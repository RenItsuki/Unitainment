import { UnifiedMediaItem } from "@/types";
import { 
  PRIMARY_STEAM_GAMES, 
  fetchSteamFeaturedGames, 
  searchSteamGames, 
  getSteamAppDetails 
} from "@/lib/api/steam";

const RAWG_BASE_URL = "https://api.rawg.io/api";
const RAWG_API_KEY = process.env.RAWG_API_KEY;

// Steam is the primary provider so games always load with reliable Steam CDN assets
export const FALLBACK_GAMES: UnifiedMediaItem[] = PRIMARY_STEAM_GAMES;

function transformRawgItem(item: any): UnifiedMediaItem {
  return {
    id: `GAME-${item.id}`,
    externalId: String(item.id),
    type: "GAME",
    title: item.name || "Unknown Game",
    originalTitle: item.name,
    posterUrl: item.background_image || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=780&auto=format&fit=crop&q=80",
    backdropUrl: item.background_image_additional || item.background_image,
    releaseDate: item.released,
    overview: item.description_raw || item.description || "An immersive gaming experience.",
    genres: (item.genres || []).map((g: any) => g.name),
    score: item.metacritic ? Math.round((item.metacritic / 10) * 10) / 10 : (item.rating ? Math.round(item.rating * 2 * 10) / 10 : undefined),
    votes: item.ratings_count,
    country: "Global",
    platforms: (item.platforms || []).map((p: any) => p.platform?.name || p.name).filter(Boolean),
    studioOrDeveloper: item.developers?.[0]?.name || item.publishers?.[0]?.name,
    trailerUrl: item.clip?.clips?.full || undefined,
    sourceUrl: `https://rawg.io/games/${item.slug || item.id}`,
    statusText: "Released",
    avgPlaytime: "30 - 80 hrs",
    price: "Available on PC/Console",
  };
}

export function filterAndSortGames(
  items: UnifiedMediaItem[],
  options: {
    genre?: string;
    country?: string;
    sort?: string;
    query?: string;
  }
): UnifiedMediaItem[] {
  let filtered = [...items];

  // Search filter
  if (options.query && options.query.trim()) {
    const q = options.query.toLowerCase().trim();
    filtered = filtered.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.originalTitle?.toLowerCase().includes(q) ||
        i.overview.toLowerCase().includes(q) ||
        i.genres.some((g) => g.toLowerCase().includes(q)) ||
        i.platforms?.some((p) => p.toLowerCase().includes(q))
    );
  }

  // Genre filter (Flexible multi-genre matching)
  if (options.genre && options.genre !== "ALL") {
    const g = options.genre.toLowerCase().trim();
    filtered = filtered.filter((i) =>
      i.genres.some((genre) => {
        const itemG = genre.toLowerCase();
        return itemG.includes(g) || g.includes(itemG);
      })
    );
  }

  // Country filter (Flexible matching)
  if (options.country && options.country !== "ALL") {
    const c = options.country.toLowerCase().trim();
    filtered = filtered.filter((i) => {
      if (!i.country) return false;
      const itemC = i.country.toLowerCase();
      if (c === "usa") return itemC === "usa" || itemC.includes("united states") || itemC === "us";
      if (c === "uk") return itemC === "uk" || itemC.includes("united kingdom") || itemC === "gb";
      if (c === "global") return true;
      return itemC.includes(c) || c.includes(itemC);
    });
  }

  // Sorting
  if (options.sort === "rating_desc") {
    filtered.sort((a, b) => (b.score || 0) - (a.score || 0));
  } else if (options.sort === "rating_asc") {
    filtered.sort((a, b) => (a.score || 0) - (b.score || 0));
  } else if (options.sort === "date_desc") {
    filtered.sort((a, b) => (b.releaseDate || "").localeCompare(a.releaseDate || ""));
  } else if (options.sort === "date_asc") {
    filtered.sort((a, b) => (a.releaseDate || "").localeCompare(b.releaseDate || ""));
  } else if (options.sort === "popular") {
    filtered.sort((a, b) => (b.votes || 0) - (a.votes || 0));
  }

  return filtered;
}

export async function fetchTrendingGames(page: number = 1): Promise<UnifiedMediaItem[]> {
  try {
    // Steam is primary as requested by user
    const steamGames = await fetchSteamFeaturedGames();
    if (steamGames && steamGames.length > 0) {
      return steamGames;
    }
    return PRIMARY_STEAM_GAMES;
  } catch (err) {
    return PRIMARY_STEAM_GAMES;
  }
}

export async function searchGames(query: string, page: number = 1): Promise<UnifiedMediaItem[]> {
  if (!query.trim()) return fetchTrendingGames(page);
  try {
    const steamResults = await searchSteamGames(query);
    if (steamResults.length > 0) {
      return filterAndSortGames(steamResults, { query });
    }
    return filterAndSortGames(PRIMARY_STEAM_GAMES, { query });
  } catch (err) {
    return filterAndSortGames(PRIMARY_STEAM_GAMES, { query });
  }
}

export async function getGameById(id: string): Promise<UnifiedMediaItem | null> {
  // Check Steam details first (Primary)
  const steamMatch = await getSteamAppDetails(id);
  if (steamMatch) return steamMatch;

  // Check fallback primary list
  const fallback = PRIMARY_STEAM_GAMES.find(
    g => g.externalId === id || g.id === id || g.externalId === `steam-${id}` || g.id === `GAME-STEAM-${id}`
  );
  if (fallback) return fallback;

  // Try RAWG only if API key is provided
  if (!RAWG_API_KEY) {
    return null;
  }
  try {
    const res = await fetch(`${RAWG_BASE_URL}/games/${id}?key=${RAWG_API_KEY}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return transformRawgItem(data);
  } catch (err) {
    return null;
  }
}
