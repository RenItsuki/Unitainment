import { NextRequest, NextResponse } from "next/server";
import { fetchTrendingMovies, fetchTrendingShows, searchMoviesAndShows, filterAndSortMedia } from "@/lib/api/tmdb";
import { fetchTopAnime, searchAnime } from "@/lib/api/mal";
import { fetchTrendingGames, searchGames } from "@/lib/api/rawg";
import { UnifiedMediaItem } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "all";
  const genre = searchParams.get("genre") || "ALL";
  const country = searchParams.get("country") || "ALL";
  const audio = searchParams.get("audio") || "ALL";
  const sort = searchParams.get("sort") || "popular";

  try {
    let items: UnifiedMediaItem[] = [];

    if (type === "movies") {
      const [movies, shows] = await Promise.all([
        q.trim() ? searchMoviesAndShows(q) : fetchTrendingMovies(),
        q.trim() ? searchMoviesAndShows(q) : fetchTrendingShows(),
      ]);
      const combined = [...movies, ...shows];
      const seen = new Set<string>();
      items = combined.filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
    } else if (type === "shows") {
      items = q.trim() ? await searchMoviesAndShows(q) : await fetchTrendingShows();
      items = items.filter((i) => i.type === "SERIES");
    } else if (type === "anime") {
      items = q.trim() ? await searchAnime(q) : await fetchTopAnime();
    } else if (type === "games") {
      items = q.trim() ? await searchGames(q) : await fetchTrendingGames();
    } else {
      // "all"
      const [movies, shows, anime, games] = await Promise.all([
        q.trim() ? searchMoviesAndShows(q) : fetchTrendingMovies(),
        q.trim() ? searchMoviesAndShows(q) : fetchTrendingShows(),
        q.trim() ? searchAnime(q) : fetchTopAnime(),
        q.trim() ? searchGames(q) : fetchTrendingGames(),
      ]);
      const combined = [...movies, ...shows, ...anime, ...games];
      const seen = new Set<string>();
      items = combined.filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
    }

    // Apply flexible filtering & sorting
    const results = filterAndSortMedia(items, {
      query: q,
      genre,
      country,
      audio,
      sort,
    });

    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error("API /api/media error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}
