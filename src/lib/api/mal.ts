import { UnifiedMediaItem } from "@/types";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

// High quality, rich anime catalog with verified working CDN poster assets
export const FALLBACK_ANIME: UnifiedMediaItem[] = [
  {
    id: "ANIME-52991",
    externalId: "52991",
    type: "ANIME",
    title: "Frieren: Beyond Journey's End",
    originalTitle: "Sousou no Frieren",
    posterUrl: "https://cdn.myanimelist.net/images/anime/1015/138006l.webp",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/dqZENchTd7lp5zht7BdlqM7RBhD.jpg",
    releaseDate: "2023-09-29",
    overview: "During their decade-long quest to defeat the Demon King, the members of the hero's party—Himmel, Heiter, Eisen, and the elven mage Frieren—forge bonds through countless battles. After their victory, Frieren witnesses the mortal passage of time.",
    genres: ["Adventure", "Drama", "Fantasy", "Magic", "Shounen"],
    score: 9.38,
    votes: 480210,
    episodes: 28,
    seasons: 1,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "Madhouse",
    trailerUrl: "https://www.youtube.com/watch?v=qgQunxD0qLk",
    sourceUrl: "https://myanimelist.net/anime/52991",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-5114",
    externalId: "5114",
    type: "ANIME",
    title: "Fullmetal Alchemist: Brotherhood",
    originalTitle: "Hagane no Renkinjutsushi: Fullmetal Alchemist",
    posterUrl: "https://cdn.myanimelist.net/images/anime/1208/94745l.webp",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2009-04-05",
    overview: "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in a catastrophic new reality. Ignoring the alchemy principle banning human transmutation, the boys attempted to resurrect their deceased mother.",
    genres: ["Action", "Adventure", "Drama", "Fantasy", "Military", "Shounen"],
    score: 9.09,
    votes: 2150000,
    episodes: 64,
    seasons: 1,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "Bones",
    trailerUrl: "https://www.youtube.com/watch?v=--IcmZkvL0Q",
    sourceUrl: "https://myanimelist.net/anime/5114",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-9253",
    externalId: "9253",
    type: "ANIME",
    title: "Steins;Gate",
    originalTitle: "Steins;Gate",
    posterUrl: "https://cdn.myanimelist.net/images/anime/1935/127974l.webp",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2011-04-06",
    overview: "Eccentric scientist Rintarou Okabe has an endless thirst for scientific exploration. Together with his ragtag gang of laboratory members, he invents a 'Phone Microwave' that accidentally sends text messages back into the past.",
    genres: ["Drama", "Sci-Fi", "Suspense", "Psychological", "Time Travel"],
    score: 9.07,
    votes: 1420000,
    episodes: 24,
    seasons: 1,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "White Fox",
    trailerUrl: "https://www.youtube.com/watch?v=27OZcZhubtY",
    sourceUrl: "https://myanimelist.net/anime/9253",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-16498",
    externalId: "16498",
    type: "ANIME",
    title: "Attack on Titan",
    originalTitle: "Shingeki no Kyojin",
    posterUrl: "https://cdn.myanimelist.net/images/anime/1517/100633l.webp",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    releaseDate: "2013-04-07",
    overview: "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. Eren Yeager vows to cleanse the earth of the giant Titans.",
    genres: ["Action", "Suspense", "Drama", "Fantasy", "Mystery", "Military"],
    score: 8.95,
    votes: 2900000,
    episodes: 87,
    seasons: 4,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "WIT Studio / MAPPA",
    trailerUrl: "https://www.youtube.com/watch?v=MGRm4IzK1SQ",
    sourceUrl: "https://myanimelist.net/anime/16498",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-11061",
    externalId: "11061",
    type: "ANIME",
    title: "Hunter x Hunter (2011)",
    originalTitle: "Hunter x Hunter",
    posterUrl: "https://cdn.myanimelist.net/images/anime/1337/99013l.webp",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2011-10-02",
    overview: "Hunters specialize in a wide variety of fields, ranging from treasure hunting to cooking. Gon Freecss sets out to become a Hunter and find his long-lost father.",
    genres: ["Action", "Adventure", "Fantasy", "Shounen"],
    score: 9.04,
    votes: 1750000,
    episodes: 148,
    seasons: 1,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "Madhouse",
    trailerUrl: "https://www.youtube.com/watch?v=d6kBeJjTGnY",
    sourceUrl: "https://myanimelist.net/anime/11061",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-38000",
    externalId: "38000",
    type: "ANIME",
    title: "Demon Slayer: Kimetsu no Yaiba",
    originalTitle: "Kimetsu no Yaiba",
    posterUrl: "https://image.tmdb.org/t/p/w780/xUfRZu2mi8jH6SzQEJGP6tjBuYj.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2019-04-06",
    overview: "Ever since the death of his father, Tanjiro Kamado has taken upon himself to support his family. When his family is slaughtered by demons and his sister Nezuko turned into one, he embarks on a dangerous journey to avenge them.",
    genres: ["Action", "Fantasy", "Historical", "Shounen"],
    score: 8.52,
    votes: 2200000,
    episodes: 55,
    seasons: 4,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "ufotable",
    trailerUrl: "https://www.youtube.com/watch?v=6vMuWuWlW4I",
    sourceUrl: "https://myanimelist.net/anime/38000",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-40748",
    externalId: "40748",
    type: "ANIME",
    title: "Jujutsu Kaisen",
    originalTitle: "Jujutsu Kaisen",
    posterUrl: "https://image.tmdb.org/t/p/w780/hHtOg63zU5lTzG45jQW3Q5PqX4F.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2020-10-03",
    overview: "Idly indulging in paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days in the clubroom or hospital visiting his grandfather. When a cursed object is unlocked, he swallows a finger belonging to the Demon King Sukuna.",
    genres: ["Action", "Fantasy", "Supernatural", "School", "Shounen"],
    score: 8.60,
    votes: 1800000,
    episodes: 47,
    seasons: 2,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "MAPPA",
    trailerUrl: "https://www.youtube.com/watch?v=pkKu9hLT-t8",
    sourceUrl: "https://myanimelist.net/anime/40748",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-50709",
    externalId: "50709",
    type: "ANIME",
    title: "Solo Leveling",
    originalTitle: "Ore dake Level Up na Ken",
    posterUrl: "https://image.tmdb.org/t/p/w780/geCRueV3ElhRTr03oddDwPtXxHQ.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2024-01-07",
    overview: "In a world where hunters, humans who possess magical abilities, battle deadly monsters, Sung Jinwoo, known as the weakest hunter of all mankind, finds himself in a continuous struggle for survival.",
    genres: ["Action", "Fantasy", "Adventure", "Super Power"],
    score: 8.35,
    votes: 410000,
    episodes: 12,
    seasons: 1,
    runtime: "24 min / ep",
    country: "South Korea",
    audioLanguage: "BOTH",
    studioOrDeveloper: "A-1 Pictures",
    trailerUrl: "https://www.youtube.com/watch?v=7hZ8WlS95bQ",
    sourceUrl: "https://myanimelist.net/anime/50709",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-1535",
    externalId: "1535",
    type: "ANIME",
    title: "Death Note",
    originalTitle: "Death Note",
    posterUrl: "https://image.tmdb.org/t/p/w780/iigTJJskR1PcjjPLi7utKq63SRb.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    releaseDate: "2006-10-04",
    overview: "Brilliant high school student Light Yagami finds a mysterious notebook that can kill anyone whose name is written in it. He decides to use it to rid the world of criminals, sparking a deadly battle of wits with the genius detective L.",
    genres: ["Supernatural", "Suspense", "Psychological", "Mystery", "Shounen"],
    score: 8.62,
    votes: 2700000,
    episodes: 37,
    seasons: 1,
    runtime: "23 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "Madhouse",
    trailerUrl: "https://www.youtube.com/watch?v=NlJZ-YgAt-c",
    sourceUrl: "https://myanimelist.net/anime/1535",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-21",
    externalId: "21",
    type: "ANIME",
    title: "One Piece",
    originalTitle: "One Piece",
    posterUrl: "https://image.tmdb.org/t/p/w780/cMD9Ygz11zjJzAvNm4hT5nS7u2f.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "1999-10-20",
    overview: "Monkey D. Luffy, a boy whose body gained the properties of rubber after unintentionally eating a Devil Fruit, explores the Grand Line with his pirate crew, the Straw Hat Pirates, in search of the legendary ultimate treasure known as the 'One Piece'.",
    genres: ["Action", "Adventure", "Fantasy", "Comedy", "Shounen"],
    score: 8.73,
    votes: 1900000,
    episodes: 1100,
    seasons: 1,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "Toei Animation",
    trailerUrl: "https://www.youtube.com/watch?v=MCb13lbKps8",
    sourceUrl: "https://myanimelist.net/anime/21",
    statusText: "Currently Airing"
  },
  {
    id: "ANIME-1735",
    externalId: "1735",
    type: "ANIME",
    title: "Naruto: Shippuden",
    originalTitle: "Naruto: Shippuuden",
    posterUrl: "https://image.tmdb.org/t/p/w780/kV27inQaie2CrHX5qYT4xR9ykag.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    releaseDate: "2007-02-15",
    overview: "Naruto Uzumaki returns to the Hidden Leaf Village after two and a half years of intense training with Jiraiya, ready to face the Akatsuki organization and bring his friend Sasuke Uchiha back home.",
    genres: ["Action", "Adventure", "Fantasy", "Martial Arts", "Shounen"],
    score: 8.28,
    votes: 2400000,
    episodes: 500,
    seasons: 1,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "Pierrot",
    trailerUrl: "https://www.youtube.com/watch?v=1dHRs1sH3vM",
    sourceUrl: "https://myanimelist.net/anime/1735",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-37521",
    externalId: "37521",
    type: "ANIME",
    title: "Vinland Saga",
    originalTitle: "Vinland Saga",
    posterUrl: "https://image.tmdb.org/t/p/w780/dmsd0aRrn7v9sA22lQo71hXwF0U.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2019-07-08",
    overview: "Young Thorfinn grew up listening to the stories of old sailors that had traveled the ocean and reached the place of legend, Vinland. But a mercenary raid led by Askeladd destroys his home, turning his life into a relentless quest for vengeance.",
    genres: ["Action", "Adventure", "Drama", "Historical", "Seinen"],
    score: 8.75,
    votes: 750000,
    episodes: 48,
    seasons: 2,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "WIT Studio / MAPPA",
    trailerUrl: "https://www.youtube.com/watch?v=f8JrZ7Q_RZg",
    sourceUrl: "https://myanimelist.net/anime/37521",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-42249",
    externalId: "42249",
    type: "ANIME",
    title: "Tokyo Revengers",
    originalTitle: "Tokyo Revengers",
    posterUrl: "https://image.tmdb.org/t/p/w780/5ZUPv8cK0Fv3cZ6y4C4hH8uL5W2.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    releaseDate: "2021-04-11",
    overview: "Takemichi Hanagaki's life is at an all-time low. When he discovers that his only middle-school girlfriend was killed by the Tokyo Manji Gang, he suddenly leaps 12 years back into his middle school days to change the future.",
    genres: ["Action", "Drama", "Supernatural", "Time Travel", "Shounen"],
    score: 7.95,
    votes: 820000,
    episodes: 50,
    seasons: 3,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "LIDENFILMS",
    trailerUrl: "https://www.youtube.com/watch?v=d_k2E9r8F1w",
    sourceUrl: "https://myanimelist.net/anime/42249",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-44511",
    externalId: "44511",
    type: "ANIME",
    title: "Chainsaw Man",
    originalTitle: "Chainsaw Man",
    posterUrl: "https://image.tmdb.org/t/p/w780/npdB6eFz4qt9CdGEg3VMw6HCXZq.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2022-10-12",
    overview: "Denji is a teenage boy living with a Chainsaw Devil named Pochita. Due to the debt his father left behind, he has been living a rock-bottom life while harvesting devil corpses with Pochita. One day, Denji is betrayed and killed.",
    genres: ["Action", "Comedy", "Horror", "Supernatural", "Shounen"],
    score: 8.51,
    votes: 980000,
    episodes: 12,
    seasons: 1,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "MAPPA",
    trailerUrl: "https://www.youtube.com/watch?v=q15CRdE5Bv0",
    sourceUrl: "https://myanimelist.net/anime/44511",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-48583",
    externalId: "48583",
    type: "ANIME",
    title: "Shingeki no Kyojin: The Final Season",
    originalTitle: "Shingeki no Kyojin: The Final Season",
    posterUrl: "https://cdn.myanimelist.net/images/anime/1000/110531l.webp",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2020-12-07",
    overview: "Gabi Braun and Falco Grice have been training their entire lives to inherit one of the seven Titans under Marley's control. But the Survey Corps launches a surprise invasion that shifts the fate of all humanity.",
    genres: ["Action", "Drama", "Suspense", "Military"],
    score: 8.81,
    votes: 980000,
    episodes: 28,
    seasons: 1,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "MAPPA",
    trailerUrl: "https://www.youtube.com/watch?v=M_OauHnAFc8",
    sourceUrl: "https://myanimelist.net/anime/48583",
    statusText: "Finished Airing"
  },
  {
    id: "ANIME-28977",
    externalId: "28977",
    type: "ANIME",
    title: "Gintama°",
    originalTitle: "Gintama°",
    posterUrl: "https://cdn.myanimelist.net/images/anime/3/72078l.webp",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2015-04-08",
    overview: "Gintoki, Shinpachi, and Kagura return as the Yorozuya in feudal Edo, taking on odd jobs while getting tangled in hilarious antics, samurai action, and emotional arcs.",
    genres: ["Action", "Comedy", "Sci-Fi", "Historical", "Parody", "Shounen"],
    score: 9.06,
    votes: 450000,
    episodes: 51,
    seasons: 4,
    runtime: "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: "BN Pictures",
    trailerUrl: "https://www.youtube.com/watch?v=F3xZ8lM_d10",
    sourceUrl: "https://myanimelist.net/anime/28977",
    statusText: "Finished Airing"
  }
];

function transformJikanItem(item: any): UnifiedMediaItem {
  const poster = item.images?.webp?.large_image_url || item.images?.jpg?.large_image_url || item.images?.webp?.image_url || item.images?.jpg?.image_url || "";
  return {
    id: `ANIME-${item.mal_id}`,
    externalId: String(item.mal_id),
    type: "ANIME",
    title: item.title_english || item.title || "Unknown Anime",
    originalTitle: item.title_japanese || item.title,
    posterUrl: poster,
    backdropUrl: item.trailer?.images?.maximum_image_url || poster,
    releaseDate: item.aired?.from ? item.aired.from.split("T")[0] : item.year ? `${item.year}-01-01` : undefined,
    overview: item.synopsis || "No synopsis available.",
    genres: (item.genres || []).map((g: any) => g.name),
    score: typeof item.score === "number" ? item.score : undefined,
    votes: item.scored_by,
    episodes: item.episodes || undefined,
    seasons: 1,
    runtime: item.duration || "24 min / ep",
    country: "Japan",
    audioLanguage: "BOTH",
    studioOrDeveloper: item.studios?.[0]?.name,
    trailerUrl: item.trailer?.url || (item.trailer?.youtube_id ? `https://www.youtube.com/watch?v=${item.trailer.youtube_id}` : undefined),
    sourceUrl: item.url || `https://myanimelist.net/anime/${item.mal_id}`,
    statusText: item.status
  };
}

export function filterAndSortAnime(
  items: UnifiedMediaItem[],
  options: {
    genre?: string;
    country?: string;
    audio?: string;
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
        i.genres.some((g) => g.toLowerCase().includes(q))
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

  // Country filter
  if (options.country && options.country !== "ALL") {
    const c = options.country.toLowerCase().trim();
    filtered = filtered.filter((i) => {
      if (!i.country) return false;
      const itemC = i.country.toLowerCase();
      if (c === "japan") return itemC === "japan" || itemC === "jp";
      if (c.includes("korea")) return itemC.includes("korea");
      return itemC.includes(c);
    });
  }

  // Audio filter
  if (options.audio && options.audio !== "ALL") {
    const a = options.audio.toUpperCase();
    filtered = filtered.filter((i) =>
      i.audioLanguage ? i.audioLanguage === a || i.audioLanguage === "BOTH" : true
    );
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

export async function fetchTopAnime(page: number = 1): Promise<UnifiedMediaItem[]> {
  try {
    const res = await fetch(`${JIKAN_BASE_URL}/top/anime?limit=25&page=${page}`, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (!res.ok) {
      return FALLBACK_ANIME;
    }
    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) {
      return FALLBACK_ANIME;
    }
    const fetched = data.data.map(transformJikanItem);
    const combined = [...fetched, ...FALLBACK_ANIME];
    const seen = new Set<string>();
    return combined.filter(a => {
      if (seen.has(a.title.toLowerCase())) return false;
      seen.add(a.title.toLowerCase());
      return true;
    });
  } catch (err) {
    return FALLBACK_ANIME;
  }
}

export async function searchAnime(query: string, page: number = 1): Promise<UnifiedMediaItem[]> {
  if (!query.trim()) return fetchTopAnime(page);
  try {
    const res = await fetch(`${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=25&page=${page}`, {
      next: { revalidate: 300 },
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (!res.ok) {
      return filterAndSortAnime(FALLBACK_ANIME, { query });
    }
    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) {
      return filterAndSortAnime(FALLBACK_ANIME, { query });
    }
    const fetched = data.data.map(transformJikanItem);
    const combined = [...fetched, ...FALLBACK_ANIME];
    return filterAndSortAnime(combined, { query });
  } catch (err) {
    return filterAndSortAnime(FALLBACK_ANIME, { query });
  }
}

export async function getAnimeById(id: string): Promise<UnifiedMediaItem | null> {
  const fallback = FALLBACK_ANIME.find(a => a.externalId === id || a.id === `ANIME-${id}` || a.id === id);
  if (fallback) return fallback;

  try {
    const res = await fetch(`${JIKAN_BASE_URL}/anime/${id}`, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (!res.ok) return fallback || null;
    const data = await res.json();
    if (!data.data) return fallback || null;
    return transformJikanItem(data.data);
  } catch (err) {
    return fallback || null;
  }
}
