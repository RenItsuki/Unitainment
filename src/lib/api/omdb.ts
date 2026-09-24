import { UnifiedMediaItem } from "@/types";

const OMDB_BASE_URL = "https://www.omdbapi.com/";
const OMDB_API_KEY = process.env.OMDB_API_KEY || "1b2e7132";

// Clean and transform an OMDb API item into a UnifiedMediaItem
export function transformOmdbItem(data: any): UnifiedMediaItem {
  const isSeries = data.Type === "series";
  const mediaType: "MOVIE" | "SERIES" = isSeries ? "SERIES" : "MOVIE";
  const imdbId = data.imdbID || "";

  // Parse rating
  let score = 7.5;
  if (data.imdbRating && data.imdbRating !== "N/A") {
    const parsed = parseFloat(data.imdbRating);
    if (!isNaN(parsed)) score = parsed;
  }

  // Parse votes
  let votes = 10000;
  if (data.imdbVotes && data.imdbVotes !== "N/A") {
    const parsed = parseInt(data.imdbVotes.replace(/,/g, ""), 10);
    if (!isNaN(parsed)) votes = parsed;
  }

  // Parse genres
  let genres: string[] = ["Action"];
  if (data.Genre && data.Genre !== "N/A") {
    genres = data.Genre.split(",").map((g: string) => g.trim());
  }

  // Parse seasons
  let seasons: number | undefined = undefined;
  if (data.totalSeasons && data.totalSeasons !== "N/A") {
    const s = parseInt(data.totalSeasons, 10);
    if (!isNaN(s)) seasons = s;
  }

  const poster = data.Poster && data.Poster !== "N/A" 
    ? data.Poster 
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80";

  return {
    id: `imdb-${imdbId}`,
    externalId: imdbId,
    type: mediaType,
    title: data.Title || "Untitled",
    originalTitle: data.Title,
    posterUrl: poster,
    backdropUrl: poster,
    releaseDate: data.Released && data.Released !== "N/A" ? data.Released : data.Year,
    overview: data.Plot && data.Plot !== "N/A" ? data.Plot : "No overview available from IMDb.",
    genres,
    score,
    votes,
    country: data.Country && data.Country !== "N/A" ? data.Country.split(",")[0].trim() : "USA",
    audioLanguage: data.Language && data.Language.toLowerCase().includes("english") ? "BOTH" : "SUB",
    runtime: data.Runtime && data.Runtime !== "N/A" ? data.Runtime : undefined,
    seasons,
    studioOrDeveloper: data.Production && data.Production !== "N/A" 
      ? data.Production 
      : data.Director && data.Director !== "N/A" 
      ? `Directed by ${data.Director}` 
      : "IMDb Studio",
    sourceUrl: `https://www.imdb.com/title/${imdbId}/`,
    statusText: isSeries ? (seasons ? `${seasons} Seasons` : "TV Series") : "Released",
    director: data.Director && data.Director !== "N/A" ? data.Director : undefined,
    writer: data.Writer && data.Writer !== "N/A" ? data.Writer : undefined,
    actors: data.Actors && data.Actors !== "N/A" ? data.Actors : undefined,
    awards: data.Awards && data.Awards !== "N/A" ? data.Awards : undefined,
    rated: data.Rated && data.Rated !== "N/A" ? data.Rated : undefined,
    boxOffice: data.BoxOffice && data.BoxOffice !== "N/A" ? data.BoxOffice : undefined,
    metascore: data.Metascore && data.Metascore !== "N/A" ? data.Metascore : undefined,
  };
}

/**
 * Fetch full movie or TV series details by IMDb ID (e.g. tt3896198)
 */
export async function getOmdbMediaById(id: string): Promise<UnifiedMediaItem | null> {
  const cleanId = id.replace(/^(imdb-|movie-|series-|MOVIE-|SERIES-)/i, "");
  if (!cleanId.startsWith("tt")) return null;

  try {
    const res = await fetch(`${OMDB_BASE_URL}?i=${cleanId}&plot=full&apikey=${OMDB_API_KEY}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.Response === "False") return null;

    return transformOmdbItem(data);
  } catch (error) {
    console.error("OMDb fetch by ID error:", error);
    return null;
  }
}

/**
 * Live search movies and series via OMDb
 */
export async function searchOmdb(
  query: string, 
  page = 1, 
  type?: "movie" | "series"
): Promise<{ items: UnifiedMediaItem[]; totalResults: number }> {
  if (!query.trim()) return { items: [], totalResults: 0 };

  try {
    const typeParam = type ? `&type=${type}` : "";
    const res = await fetch(
      `${OMDB_BASE_URL}?s=${encodeURIComponent(query)}&page=${page}${typeParam}&apikey=${OMDB_API_KEY}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return { items: [], totalResults: 0 };
    const data = await res.json();
    if (data.Response === "False" || !data.Search) {
      return { items: [], totalResults: 0 };
    }

    const totalResults = parseInt(data.totalResults || "0", 10);
    const items: UnifiedMediaItem[] = data.Search.map((item: any) => ({
      id: `imdb-${item.imdbID}`,
      externalId: item.imdbID,
      type: item.Type === "series" ? "SERIES" : "MOVIE",
      title: item.Title,
      posterUrl: item.Poster && item.Poster !== "N/A" 
        ? item.Poster 
        : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
      releaseDate: item.Year,
      overview: `${item.Title} (${item.Year}) — View on IMDb for full synopsis, cast, ratings, and reviews.`,
      genres: ["Featured"],
      score: 8.0,
      votes: 50000,
      country: "USA",
      sourceUrl: `https://www.imdb.com/title/${item.imdbID}/`,
      statusText: item.Type === "series" ? "TV Series" : "Movie",
    }));

    return { items, totalResults };
  } catch (error) {
    console.error("OMDb search error:", error);
    return { items: [], totalResults: 0 };
  }
}

/**
 * Prominent IMDb Showcase Titles (Pre-loaded with verified IMDb data)
 */
export const IMDB_SHOWCASE_TITLES: UnifiedMediaItem[] = [
  {
    id: "imdb-tt3896198",
    externalId: "tt3896198",
    type: "MOVIE",
    title: "Guardians of the Galaxy Vol. 2",
    originalTitle: "Guardians of the Galaxy: Vol. 2",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_QL75_UX380_CR0,1,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BNWE5MGI3MDctMmU5Ni00YzI2LWEzMTQtZGIyZDA5MzQzNDBhXkEyXkFqcGc@._V1_QL75_UX380_CR0,1,380,562_.jpg",
    releaseDate: "05 May 2017",
    overview: "The Guardians struggle to keep together as a team while dealing with their personal family issues, notably Star-Lord's encounter with his father, the ambitious celestial being Ego.",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    score: 7.6,
    votes: 828114,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "136 min",
    director: "James Gunn",
    writer: "James Gunn, Dan Abnett, Andy Lanning",
    actors: "Chris Pratt, Zoe Saldaña, Dave Bautista, Bradley Cooper",
    awards: "Nominated for 1 Oscar. 15 wins & 62 nominations total",
    rated: "PG-13",
    boxOffice: "$389,813,101",
    metascore: "67",
    studioOrDeveloper: "Marvel Studios / Walt Disney Studios",
    sourceUrl: "https://www.imdb.com/title/tt3896198/",
    statusText: "Released",
    trailerUrl: "https://www.youtube.com/watch?v=2XqQMCg66V0"
  },
  {
    id: "imdb-tt0111161",
    externalId: "tt0111161",
    type: "MOVIE",
    title: "The Shawshank Redemption",
    originalTitle: "The Shawshank Redemption",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    releaseDate: "14 Oct 1994",
    overview: "Chronicles the experiences of a formerly successful banker as a prisoner in the gloomy jailhouse of Shawshank after being found guilty of a crime he did not commit. The film portrays the man's unique way of dealing with his new, torturous life.",
    genres: ["Drama", "Crime"],
    score: 9.3,
    votes: 3235958,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "142 min",
    director: "Frank Darabont",
    writer: "Stephen King, Frank Darabont",
    actors: "Tim Robbins, Morgan Freeman, Bob Gunton",
    awards: "Nominated for 7 Oscars. 21 wins & 43 nominations total",
    rated: "R",
    boxOffice: "$28,767,189",
    metascore: "82",
    studioOrDeveloper: "Castle Rock Entertainment",
    sourceUrl: "https://www.imdb.com/title/tt0111161/",
    statusText: "Released",
    trailerUrl: "https://www.youtube.com/watch?v=PLl99DlL6b4"
  },
  {
    id: "imdb-tt0903747",
    externalId: "tt0903747",
    type: "SERIES",
    title: "Breaking Bad",
    originalTitle: "Breaking Bad",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOWE4NTc3YmYtNmU2Mi00ZjhkLWE1MTItZmM1M2U1ODU3YjFlXkEyXkFqcGc@._V1_QL75_UY562_CR2,0,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BOWE4NTc3YmYtNmU2Mi00ZjhkLWE1MTItZmM1M2U1ODU3YjFlXkEyXkFqcGc@._V1_QL75_UY562_CR2,0,380,562_.jpg",
    releaseDate: "2008–2013",
    overview: "A chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine with a former student to secure his family's future.",
    genres: ["Crime", "Drama", "Thriller"],
    score: 9.5,
    votes: 2671962,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "49 min",
    seasons: 5,
    episodes: 62,
    director: "Vince Gilligan",
    writer: "Vince Gilligan",
    actors: "Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris",
    awards: "Won 16 Primetime Emmys. 172 wins & 269 nominations total",
    rated: "TV-MA",
    studioOrDeveloper: "High Bridge Productions / Sony Pictures Television / AMC",
    sourceUrl: "https://www.imdb.com/title/tt0903747/",
    statusText: "5 Seasons Completed",
    trailerUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY"
  },
  {
    id: "imdb-tt0468569",
    externalId: "tt0468569",
    type: "MOVIE",
    title: "The Dark Knight",
    originalTitle: "The Dark Knight",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    releaseDate: "18 Jul 2008",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    score: 9.0,
    votes: 2980000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "152 min",
    director: "Christopher Nolan",
    writer: "Jonathan Nolan, Christopher Nolan, David S. Goyer",
    actors: "Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine",
    awards: "Won 2 Oscars. 164 wins & 164 nominations total",
    rated: "PG-13",
    boxOffice: "$534,987,076",
    metascore: "84",
    studioOrDeveloper: "Warner Bros. Pictures / Legendary",
    sourceUrl: "https://www.imdb.com/title/tt0468569/",
    statusText: "Released",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY"
  },
  {
    id: "imdb-tt0944947",
    externalId: "tt0944947",
    type: "SERIES",
    title: "Game of Thrones",
    originalTitle: "Game of Thrones",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_QL75_UX380_CR0,3,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BMTNhMDJmNmYtNDQ5OS00ODdlLWE0ZDAtZTgyYTIwNDY3OTU3XkEyXkFqcGc@._V1_QL75_UX380_CR0,3,380,562_.jpg",
    releaseDate: "2011–2019",
    overview: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    genres: ["Action", "Adventure", "Drama", "Fantasy"],
    score: 9.2,
    votes: 2320000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "57 min",
    seasons: 8,
    episodes: 73,
    director: "David Benioff, D.B. Weiss",
    writer: "David Benioff, D.B. Weiss, George R.R. Martin",
    actors: "Emilia Clarke, Peter Dinklage, Kit Harington, Lena Headey",
    awards: "Won 59 Primetime Emmys. 392 wins & 627 nominations total",
    rated: "TV-MA",
    studioOrDeveloper: "HBO Entertainment / Warner Bros.",
    sourceUrl: "https://www.imdb.com/title/tt0944947/",
    statusText: "8 Seasons Completed",
    trailerUrl: "https://www.youtube.com/watch?v=KPLWWIOCOOQ"
  },
  {
    id: "imdb-tt1375666",
    externalId: "tt1375666",
    type: "MOVIE",
    title: "Inception",
    originalTitle: "Inception",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    releaseDate: "16 Jul 2010",
    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    genres: ["Action", "Adventure", "Sci-Fi", "Thriller"],
    score: 8.8,
    votes: 2600000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "148 min",
    director: "Christopher Nolan",
    writer: "Christopher Nolan",
    actors: "Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy",
    awards: "Won 4 Oscars. 159 wins & 220 nominations total",
    rated: "PG-13",
    boxOffice: "$292,587,330",
    metascore: "74",
    studioOrDeveloper: "Warner Bros. Pictures / Syncopy",
    sourceUrl: "https://www.imdb.com/title/tt1375666/",
    statusText: "Released",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0"
  },
  {
    id: "imdb-tt4574334",
    externalId: "tt4574334",
    type: "SERIES",
    title: "Stranger Things",
    originalTitle: "Stranger Things",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjEzMDAxOTUyMV5BMl5BanBnXkFtZTgwNzAxMzYzOTE@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BMjEzMDAxOTUyMV5BMl5BanBnXkFtZTgwNzAxMzYzOTE@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    releaseDate: "2016–",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    genres: ["Drama", "Fantasy", "Horror", "Mystery", "Sci-Fi"],
    score: 8.7,
    votes: 1400000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "51 min",
    seasons: 4,
    episodes: 34,
    director: "The Duffer Brothers",
    writer: "Matt Duffer, Ross Duffer",
    actors: "Millie Bobby Brown, Finn Wolfhard, Winona Ryder, David Harbour",
    awards: "Won 12 Primetime Emmys. 109 wins & 320 nominations total",
    rated: "TV-14",
    studioOrDeveloper: "21 Laps Entertainment / Netflix",
    sourceUrl: "https://www.imdb.com/title/tt4574334/",
    statusText: "4 Seasons Available",
    trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU"
  },
  {
    id: "imdb-tt1877830",
    externalId: "tt1877830",
    type: "MOVIE",
    title: "The Batman",
    originalTitle: "The Batman",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BMmU5NGJlMzAtMGNmOC00YjJjLTgyMzUtNjAyYmE4Njg5YWMyXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    releaseDate: "04 Mar 2022",
    overview: "When a sadistic serial killer begins murdering key political figures in Gotham, the Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    genres: ["Action", "Crime", "Drama", "Mystery"],
    score: 7.8,
    votes: 780000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "176 min",
    director: "Matt Reeves",
    writer: "Matt Reeves, Peter Craig, Bob Kane",
    actors: "Robert Pattinson, Zoë Kravitz, Jeffrey Wright, Colin Farrell",
    awards: "Nominated for 3 Oscars. 39 wins & 171 nominations total",
    rated: "PG-13",
    boxOffice: "$369,345,583",
    metascore: "72",
    studioOrDeveloper: "Warner Bros. Pictures / 6th & Idaho",
    sourceUrl: "https://www.imdb.com/title/tt1877830/",
    statusText: "Released",
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4"
  },
  {
    id: "imdb-tt1190634",
    externalId: "tt1190634",
    type: "SERIES",
    title: "The Boys",
    originalTitle: "The Boys",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjU4OWNiYzQtMzc1NS00NjZlLTgyYTctZWY4ZmEzMTkxYjA4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BZjU4OWNiYzQtMzc1NS00NjZlLTgyYTctZWY4ZmEzMTkxYjA4XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    releaseDate: "2019–",
    overview: "A fun and irreverent take on what happens when superheroes—who are as popular as celebrities, as influential as politicians, and as revered as gods—abuse their superpowers rather than use them for good.",
    genres: ["Action", "Comedy", "Crime", "Drama", "Sci-Fi"],
    score: 8.7,
    votes: 720000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "60 min",
    seasons: 4,
    episodes: 32,
    director: "Eric Kripke",
    writer: "Eric Kripke",
    actors: "Karl Urban, Jack Quaid, Antony Starr, Erin Moriarty",
    awards: "Nominated for 8 Primetime Emmys. 15 wins & 90 nominations total",
    rated: "TV-MA",
    studioOrDeveloper: "Sony Pictures Television / Amazon Studios",
    sourceUrl: "https://www.imdb.com/title/tt1190634/",
    statusText: "4 Seasons Available",
    trailerUrl: "https://www.youtube.com/watch?v=5SKP1_27K6M"
  },
  {
    id: "imdb-tt0137523",
    externalId: "tt0137523",
    type: "MOVIE",
    title: "Fight Club",
    originalTitle: "Fight Club",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BOTgyOGQ1NDItNGU3Ny00MjU3LTg2YWEtNmEyYjBiMjI1Y2M5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    releaseDate: "15 Oct 1999",
    overview: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    genres: ["Drama"],
    score: 8.8,
    votes: 2360000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "139 min",
    director: "David Fincher",
    writer: "Chuck Palahniuk, Jim Uhls",
    actors: "Brad Pitt, Edward Norton, Helena Bonham Carter, Meat Loaf",
    awards: "Nominated for 1 Oscar. 12 wins & 38 nominations total",
    rated: "R",
    boxOffice: "$37,030,102",
    metascore: "67",
    studioOrDeveloper: "Fox 2000 Pictures / Regency Enterprises",
    sourceUrl: "https://www.imdb.com/title/tt0137523/",
    statusText: "Released",
    trailerUrl: "https://www.youtube.com/watch?v=qtRKdVHc-cE"
  }
];
