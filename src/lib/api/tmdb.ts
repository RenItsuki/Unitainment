import { UnifiedMediaItem } from "@/types";
import { getOmdbMediaById, searchOmdb, IMDB_SHOWCASE_TITLES } from "./omdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w780";
const TMDB_BACKDROP_BASE = "https://image.tmdb.org/t/p/w1280";

const TMDB_API_KEY = process.env.TMDB_API_KEY;

export const FALLBACK_MOVIES: UnifiedMediaItem[] = [
  ...IMDB_SHOWCASE_TITLES,

  // --- MOVIES ---
  {
    id: "MOVIE-872585",
    externalId: "872585",
    type: "MOVIE",
    title: "Oppenheimer",
    originalTitle: "Oppenheimer",
    posterUrl: "https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    releaseDate: "2023-07-21",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II, his inner turmoil, and the political aftermath during the Red Scare.",
    genres: ["Drama", "History", "Biography"],
    score: 8.9,
    votes: 840000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "180 min",
    studioOrDeveloper: "Universal Pictures / Syncopy",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    sourceUrl: "https://www.imdb.com/title/tt15398776/",
    statusText: "Released"
  },
  {
    id: "MOVIE-693134",
    externalId: "693134",
    type: "MOVIE",
    title: "Dune: Part Two",
    originalTitle: "Dune: Part Two",
    posterUrl: "https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5200SV.jpg",
    releaseDate: "2024-03-01",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
    genres: ["Sci-Fi", "Adventure", "Action"],
    score: 8.6,
    votes: 560000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "166 min",
    studioOrDeveloper: "Warner Bros. Pictures / Legendary",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    sourceUrl: "https://www.imdb.com/title/tt15239678/",
    statusText: "Released"
  },
  {
    id: "MOVIE-496243",
    externalId: "496243",
    type: "MOVIE",
    title: "Parasite",
    originalTitle: "Gisaengchung",
    posterUrl: "https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg",
    releaseDate: "2019-05-30",
    overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
    genres: ["Thriller", "Comedy", "Drama"],
    score: 8.5,
    votes: 930000,
    country: "South Korea",
    audioLanguage: "SUB",
    runtime: "132 min",
    studioOrDeveloper: "CJ Entertainment / Barunson",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0hhJ98Xg",
    sourceUrl: "https://www.imdb.com/title/tt6751668/",
    statusText: "Released"
  },
  {
    id: "MOVIE-157336",
    externalId: "157336",
    type: "MOVIE",
    title: "Interstellar",
    originalTitle: "Interstellar",
    posterUrl: "https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    releaseDate: "2014-11-07",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    genres: ["Adventure", "Drama", "Sci-Fi"],
    score: 8.7,
    votes: 2100000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "169 min",
    studioOrDeveloper: "Paramount / Warner Bros.",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    sourceUrl: "https://www.imdb.com/title/tt0816692/",
    statusText: "Released"
  },
  {
    id: "MOVIE-155",
    externalId: "155",
    type: "MOVIE",
    title: "The Dark Knight",
    originalTitle: "The Dark Knight",
    posterUrl: "https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/hkBaDkMWbLaf8B1rsqPpCYPt7x6.jpg",
    releaseDate: "2008-07-18",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
    genres: ["Action", "Crime", "Drama", "Thriller"],
    score: 9.0,
    votes: 2900000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "152 min",
    studioOrDeveloper: "Warner Bros. Pictures",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    sourceUrl: "https://www.imdb.com/title/tt0468569/",
    statusText: "Released"
  },
  {
    id: "MOVIE-27205",
    externalId: "27205",
    type: "MOVIE",
    title: "Inception",
    originalTitle: "Inception",
    posterUrl: "https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    releaseDate: "2010-07-16",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\".",
    genres: ["Action", "Sci-Fi", "Adventure", "Thriller"],
    score: 8.8,
    votes: 2500000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "148 min",
    studioOrDeveloper: "Warner Bros. Pictures / Syncopy",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    sourceUrl: "https://www.imdb.com/title/tt1375666/",
    statusText: "Released"
  },
  {
    id: "MOVIE-569094",
    externalId: "569094",
    type: "MOVIE",
    title: "Spider-Man: Across the Spider-Verse",
    originalTitle: "Spider-Man: Across the Spider-Verse",
    posterUrl: "https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    releaseDate: "2023-06-02",
    overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse’s very existence.",
    genres: ["Animation", "Action", "Adventure", "Sci-Fi"],
    score: 8.7,
    votes: 610000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "140 min",
    studioOrDeveloper: "Sony Pictures Animation / Marvel",
    trailerUrl: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    sourceUrl: "https://www.imdb.com/title/tt9362722/",
    statusText: "Released"
  },
  {
    id: "MOVIE-299534",
    externalId: "299534",
    type: "MOVIE",
    title: "Avengers: Endgame",
    originalTitle: "Avengers: Endgame",
    posterUrl: "https://image.tmdb.org/t/p/w780/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    releaseDate: "2019-04-26",
    overview: "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions.",
    genres: ["Action", "Adventure", "Sci-Fi"],
    score: 8.4,
    votes: 1250000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "181 min",
    studioOrDeveloper: "Marvel Studios",
    trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    sourceUrl: "https://www.imdb.com/title/tt4154796/",
    statusText: "Released"
  },
  {
    id: "MOVIE-129",
    externalId: "129",
    type: "MOVIE",
    title: "Spirited Away",
    originalTitle: "Sen to Chihiro no Kamikakushi",
    posterUrl: "https://image.tmdb.org/t/p/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg",
    releaseDate: "2001-07-20",
    overview: "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    genres: ["Animation", "Fantasy", "Adventure", "Family"],
    score: 8.6,
    votes: 820000,
    country: "Japan",
    audioLanguage: "BOTH",
    runtime: "125 min",
    studioOrDeveloper: "Studio Ghibli",
    trailerUrl: "https://www.youtube.com/watch?v=ByXuk9QqQkk",
    sourceUrl: "https://www.imdb.com/title/tt0245429/",
    statusText: "Released"
  },
  {
    id: "MOVIE-372058",
    externalId: "372058",
    type: "MOVIE",
    title: "Your Name.",
    originalTitle: "Kimi no Na wa.",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYzY1OWZiN2YtMWU3My00M2YyLWI1M2EtNTljMTMwMzM5NDQ0XkEyXkFqcGc@._V1_SX300.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BYzY1OWZiN2YtMWU3My00M2YyLWI1M2EtNTljMTMwMzM5NDQ0XkEyXkFqcGc@._V1_SX300.jpg",
    releaseDate: "2016-08-26",
    overview: "High schoolers Mitsuha and Taki are complete strangers living separate lives in rural Itomori and Tokyo. But when Mitsuha makes a wish to leave her mountain town for the bustling city, they mysteriously begin swapping bodies.",
    genres: ["Animation", "Romance", "Drama", "Fantasy"],
    score: 8.5,
    votes: 560000,
    country: "Japan",
    audioLanguage: "BOTH",
    runtime: "106 min",
    studioOrDeveloper: "CoMix Wave Films / Toho",
    trailerUrl: "https://www.youtube.com/watch?v=s0wTdCQoc2k",
    sourceUrl: "https://www.imdb.com/title/tt5311514/",
    statusText: "Released"
  },
  {
    id: "MOVIE-545611",
    externalId: "545611",
    type: "MOVIE",
    title: "Everything Everywhere All at Once",
    originalTitle: "Everything Everywhere All at Once",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BOWNmMzAzZmQtNDQ1NC00Nzk5LTkyMmUtNGI2N2NkOWM4MzEyXkEyXkFqcGc@._V1_QL75_UY562_CR4,0,380,562_.jpg",
    releaseDate: "2022-03-25",
    overview: "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what's important to her by connecting with the lives she could have led across parallel universes.",
    genres: ["Action", "Adventure", "Comedy", "Sci-Fi"],
    score: 8.0,
    votes: 520000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "139 min",
    studioOrDeveloper: "A24",
    trailerUrl: "https://www.youtube.com/watch?v=wxN1T1uxQ2g",
    sourceUrl: "https://www.imdb.com/title/tt6710474/",
    statusText: "Released"
  },
  {
    id: "MOVIE-346698",
    externalId: "346698",
    type: "MOVIE",
    title: "Barbie",
    originalTitle: "Barbie",
    posterUrl: "https://image.tmdb.org/t/p/w780/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/nHf61UzkfFno5X1ofIhugCPus2R.jpg",
    releaseDate: "2023-07-21",
    overview: "To live in Barbie Land is to be a perfect being in a perfect place. Unless you have a full-on existential crisis. Or you're a Ken.",
    genres: ["Comedy", "Adventure", "Fantasy"],
    score: 7.8,
    votes: 620000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "114 min",
    studioOrDeveloper: "Warner Bros. Pictures / LuckyChap",
    trailerUrl: "https://www.youtube.com/watch?v=pBk4NYhWNMM",
    sourceUrl: "https://www.imdb.com/title/tt1517268/",
    statusText: "Released"
  },
  {
    id: "MOVIE-414906",
    externalId: "414906",
    type: "MOVIE",
    title: "The Batman",
    originalTitle: "The Batman",
    posterUrl: "https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/b0PlSFdDwbyK0cf5RxwDpaxtQvQ.jpg",
    releaseDate: "2022-03-04",
    overview: "In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.",
    genres: ["Action", "Crime", "Drama", "Mystery"],
    score: 8.1,
    votes: 790000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "176 min",
    studioOrDeveloper: "Warner Bros. Pictures / DC Films",
    trailerUrl: "https://www.youtube.com/watch?v=mqqft2x_Aa4",
    sourceUrl: "https://www.imdb.com/title/tt1877830/",
    statusText: "Released"
  },
  {
    id: "MOVIE-680",
    externalId: "680",
    type: "MOVIE",
    title: "Pulp Fiction",
    originalTitle: "Pulp Fiction",
    posterUrl: "https://image.tmdb.org/t/p/w780/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    releaseDate: "1994-10-14",
    overview: "A burger-loving hit man, his philosophical partner, a drug-addled gangster's moll and a washed-up boxer converge in this sprawling, comedic crime caper.",
    genres: ["Crime", "Drama", "Comedy", "Thriller"],
    score: 8.9,
    votes: 2100000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "154 min",
    studioOrDeveloper: "Miramax Films / A Band Apart",
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    sourceUrl: "https://www.imdb.com/title/tt0110912/",
    statusText: "Released"
  },
  {
    id: "MOVIE-550",
    externalId: "550",
    type: "MOVIE",
    title: "Fight Club",
    originalTitle: "Fight Club",
    posterUrl: "https://image.tmdb.org/t/p/w780/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
    releaseDate: "1999-10-15",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town.",
    genres: ["Drama", "Thriller", "Action"],
    score: 8.8,
    votes: 2300000,
    country: "USA",
    audioLanguage: "BOTH",
    runtime: "139 min",
    studioOrDeveloper: "Fox 2000 Pictures / Regency",
    trailerUrl: "https://www.youtube.com/watch?v=qtRKdV9EIJU",
    sourceUrl: "https://www.imdb.com/title/tt0137523/",
    statusText: "Released"
  },
  {
    id: "MOVIE-579974",
    externalId: "579974",
    type: "MOVIE",
    title: "RRR",
    originalTitle: "RRR",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNWMwODYyMjQtMTczMi00NTQ1LWFkYjItMGJhMWRkY2E3NDAyXkEyXkFqcGc@._V1_SX300.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BNWMwODYyMjQtMTczMi00NTQ1LWFkYjItMGJhMWRkY2E3NDAyXkEyXkFqcGc@._V1_SX300.jpg",
    releaseDate: "2022-03-24",
    overview: "A fictional history of two legendary revolutionaries' journey away from home before they began fighting for their country in the 1920s.",
    genres: ["Action", "Drama", "History", "Adventure"],
    score: 8.2,
    votes: 210000,
    country: "India",
    audioLanguage: "BOTH",
    runtime: "187 min",
    studioOrDeveloper: "DVV Entertainment",
    trailerUrl: "https://www.youtube.com/watch?v=NgBoMJy386M",
    sourceUrl: "https://www.imdb.com/title/tt8178634/",
    statusText: "Released"
  },
  {
    id: "MOVIE-20453",
    externalId: "20453",
    type: "MOVIE",
    title: "3 Idiots",
    originalTitle: "3 Idiots",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_SX300.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BNzc4ZWQ3NmYtODE0Ny00YTQ4LTlkZWItNTBkMGQ0MmUwMmJlXkEyXkFqcGc@._V1_SX300.jpg",
    releaseDate: "2009-12-25",
    overview: "Two friends search for their long-lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently, even as the rest of the world called them 'idiots'.",
    genres: ["Comedy", "Drama"],
    score: 8.4,
    votes: 410000,
    country: "India",
    audioLanguage: "BOTH",
    runtime: "170 min",
    studioOrDeveloper: "Vinod Chopra Films",
    trailerUrl: "https://www.youtube.com/watch?v=K0eDlFX9GMc",
    sourceUrl: "https://www.imdb.com/title/tt1187043/",
    statusText: "Released"
  },
  {
    id: "MOVIE-194",
    externalId: "194",
    type: "MOVIE",
    title: "Amélie",
    originalTitle: "Le Fabuleux Destin d'Amélie Poulain",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOTNmYzY0MWQtZGZmNy00Y2Y4LWFmMDQtMTZjYTdiYzEwZGQ2XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BOTNmYzY0MWQtZGZmNy00Y2Y4LWFmMDQtMTZjYTdiYzEwZGQ2XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    releaseDate: "2001-04-25",
    overview: "Amélie is an innocent and naive girl in Paris with her own sense of justice. She decides to help those around her and, along the way, discovers love.",
    genres: ["Comedy", "Romance", "Drama"],
    score: 8.3,
    votes: 750000,
    country: "France",
    audioLanguage: "SUB",
    runtime: "122 min",
    studioOrDeveloper: "Claudie Ossard Productions",
    trailerUrl: "https://www.youtube.com/watch?v=HUECWi5pX7o",
    sourceUrl: "https://www.imdb.com/title/tt0211915/",
    statusText: "Released"
  },

  // --- TV SERIES ---
  {
    id: "SERIES-1396",
    externalId: "1396",
    type: "SERIES",
    title: "Breaking Bad",
    originalTitle: "Breaking Bad",
    posterUrl: "https://image.tmdb.org/t/p/w780/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg",
    releaseDate: "2008-01-20",
    overview: "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years to live. He chooses to enter a dangerous world of drugs and crime to secure his family's financial future.",
    genres: ["Crime", "Drama", "Thriller"],
    score: 9.5,
    votes: 2200000,
    country: "USA",
    audioLanguage: "BOTH",
    episodes: 62,
    seasons: 5,
    runtime: "47 min / ep",
    studioOrDeveloper: "AMC / Sony Pictures",
    trailerUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY",
    sourceUrl: "https://www.imdb.com/title/tt0903747/",
    statusText: "Ended"
  },
  {
    id: "SERIES-66732",
    externalId: "66732",
    type: "SERIES",
    title: "Stranger Things",
    originalTitle: "Stranger Things",
    posterUrl: "https://image.tmdb.org/t/p/w780/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    releaseDate: "2016-07-15",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    genres: ["Drama", "Fantasy", "Horror", "Mystery", "Sci-Fi"],
    score: 8.7,
    votes: 1400000,
    country: "USA",
    audioLanguage: "BOTH",
    episodes: 34,
    seasons: 4,
    runtime: "50 min / ep",
    studioOrDeveloper: "Netflix / 21 Laps",
    trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    sourceUrl: "https://www.imdb.com/title/tt4574334/",
    statusText: "Returning Series"
  },
  {
    id: "SERIES-93405",
    externalId: "93405",
    type: "SERIES",
    title: "Squid Game",
    originalTitle: "Ojingeo Geim",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYTU3ZDVhNmMtMDVlNC00MDc0LTgwNDMtYWE5MTI2ZGI4YWIwXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BYTU3ZDVhNmMtMDVlNC00MDc0LTgwNDMtYWE5MTI2ZGI4YWIwXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    releaseDate: "2021-09-17",
    overview: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    genres: ["Action", "Drama", "Mystery", "Thriller"],
    score: 8.0,
    votes: 620000,
    country: "South Korea",
    audioLanguage: "BOTH",
    episodes: 9,
    seasons: 2,
    runtime: "55 min / ep",
    studioOrDeveloper: "Siren Pictures / Netflix",
    trailerUrl: "https://www.youtube.com/watch?v=oqxAJKy0ii4",
    sourceUrl: "https://www.imdb.com/title/tt10919420/",
    statusText: "Returning Series"
  },
  {
    id: "SERIES-70523",
    externalId: "70523",
    type: "SERIES",
    title: "Dark",
    originalTitle: "Dark",
    posterUrl: "https://image.tmdb.org/t/p/w780/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/3lBDg3i6nn5R2NKICJ79flK9Ox8.jpg",
    releaseDate: "2017-12-01",
    overview: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations in a small German town.",
    genres: ["Sci-Fi", "Mystery", "Drama", "Thriller"],
    score: 8.7,
    votes: 450000,
    country: "Germany",
    audioLanguage: "BOTH",
    episodes: 26,
    seasons: 3,
    runtime: "60 min / ep",
    studioOrDeveloper: "Wiedemann & Berg / Netflix",
    trailerUrl: "https://www.youtube.com/watch?v=rrwycJ08PSA",
    sourceUrl: "https://www.imdb.com/title/tt5753856/",
    statusText: "Ended"
  },
  {
    id: "SERIES-1399",
    externalId: "1399",
    type: "SERIES",
    title: "Game of Thrones",
    originalTitle: "Game of Thrones",
    posterUrl: "https://image.tmdb.org/t/p/w780/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    releaseDate: "2011-04-17",
    overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
    genres: ["Fantasy", "Drama", "Action", "Adventure"],
    score: 9.2,
    votes: 2400000,
    country: "USA",
    audioLanguage: "BOTH",
    episodes: 73,
    seasons: 8,
    runtime: "57 min / ep",
    studioOrDeveloper: "HBO",
    trailerUrl: "https://www.youtube.com/watch?v=KPLWWIOCOOQ",
    sourceUrl: "https://www.imdb.com/title/tt0944947/",
    statusText: "Ended"
  },
  {
    id: "SERIES-100088",
    externalId: "100088",
    type: "SERIES",
    title: "The Last of Us",
    originalTitle: "The Last of Us",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BYWI3ODJlMzktY2U5NC00ZjdlLWE1MGItNWQxZDk3NWNjN2RhXkEyXkFqcGc@._V1_QL75_UX380_CR0,0,380,562_.jpg",
    releaseDate: "2023-01-15",
    overview: "20 years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone. What starts as a small job soon becomes a brutal journey.",
    genres: ["Drama", "Action", "Sci-Fi", "Horror", "Adventure"],
    score: 8.8,
    votes: 590000,
    country: "USA",
    audioLanguage: "BOTH",
    episodes: 9,
    seasons: 1,
    runtime: "59 min / ep",
    studioOrDeveloper: "HBO / Sony Pictures",
    trailerUrl: "https://www.youtube.com/watch?v=uLtkt8BonwM",
    sourceUrl: "https://www.imdb.com/title/tt3581920/",
    statusText: "Returning Series"
  },
  {
    id: "SERIES-76479",
    externalId: "76479",
    type: "SERIES",
    title: "The Boys",
    originalTitle: "The Boys",
    posterUrl: "https://image.tmdb.org/t/p/w780/2zmTngn1tYC1AvfnrFLhxeD82hz.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg",
    releaseDate: "2019-07-26",
    overview: "A fun and irreverent take on what happens when superheroes—who are as popular as celebrities, as influential as politicians, and as revered as gods—abuse their superpowers rather than use them for good.",
    genres: ["Action", "Comedy", "Sci-Fi", "Drama"],
    score: 8.7,
    votes: 720000,
    country: "USA",
    audioLanguage: "BOTH",
    episodes: 32,
    seasons: 4,
    runtime: "60 min / ep",
    studioOrDeveloper: "Amazon Studios / Sony Pictures",
    trailerUrl: "https://www.youtube.com/watch?v=06rueu_fh30",
    sourceUrl: "https://www.imdb.com/title/tt1190634/",
    statusText: "Returning Series"
  },
  {
    id: "SERIES-94605",
    externalId: "94605",
    type: "SERIES",
    title: "Arcane",
    originalTitle: "Arcane: League of Legends",
    posterUrl: "https://image.tmdb.org/t/p/w780/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/mabWz6J84pPZzYkFhD0i8Kz7Wl2.jpg",
    releaseDate: "2021-11-06",
    overview: "Set in the utopian region of Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League of Legends champions-and the power that will tear them apart.",
    genres: ["Animation", "Sci-Fi", "Action", "Adventure", "Fantasy", "Drama"],
    score: 9.0,
    votes: 350000,
    country: "USA",
    audioLanguage: "BOTH",
    episodes: 18,
    seasons: 2,
    runtime: "40 min / ep",
    studioOrDeveloper: "Riot Games / Fortiche",
    trailerUrl: "https://www.youtube.com/watch?v=fXmAurh012s",
    sourceUrl: "https://www.imdb.com/title/tt11126994/",
    statusText: "Ended"
  },
  {
    id: "SERIES-71446",
    externalId: "71446",
    type: "SERIES",
    title: "Money Heist",
    originalTitle: "La Casa de Papel",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZjkxZWJiNTUtYjQwYS00MTBlLTgwODQtM2FkNWMyMjMwOGZiXkEyXkFqcGc@._V1_QL75_UX380_CR0,5,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BZjkxZWJiNTUtYjQwYS00MTBlLTgwODQtM2FkNWMyMjMwOGZiXkEyXkFqcGc@._V1_QL75_UX380_CR0,5,380,562_.jpg",
    releaseDate: "2017-05-02",
    overview: "To carry out the biggest heist in history, a mysterious man called The Professor recruits a band of eight robbers who have a single characteristic: none of them has anything to lose.",
    genres: ["Crime", "Drama", "Thriller", "Action"],
    score: 8.2,
    votes: 560000,
    country: "Spain",
    audioLanguage: "BOTH",
    episodes: 41,
    seasons: 5,
    runtime: "50 min / ep",
    studioOrDeveloper: "Atresmedia / Netflix",
    trailerUrl: "https://www.youtube.com/watch?v=htqXL94Rza4",
    sourceUrl: "https://www.imdb.com/title/tt6468322/",
    statusText: "Ended"
  },
  {
    id: "SERIES-19885",
    externalId: "19885",
    type: "SERIES",
    title: "Sherlock",
    originalTitle: "Sherlock",
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNTQzNGZjNDEtOTMwYi00MzFjLWE2ZTYtYzYxYzMwMjZkZDc5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    backdropUrl: "https://m.media-amazon.com/images/M/MV5BNTQzNGZjNDEtOTMwYi00MzFjLWE2ZTYtYzYxYzMwMjZkZDc5XkEyXkFqcGc@._V1_QL75_UX380_CR0,4,380,562_.jpg",
    releaseDate: "2010-07-25",
    overview: "A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.",
    genres: ["Crime", "Drama", "Mystery"],
    score: 8.9,
    votes: 980000,
    country: "UK",
    audioLanguage: "BOTH",
    episodes: 13,
    seasons: 4,
    runtime: "90 min / ep",
    studioOrDeveloper: "BBC / Hartswood Films",
    trailerUrl: "https://www.youtube.com/watch?v=xK7S9mrFWL4",
    sourceUrl: "https://www.imdb.com/title/tt1475582/",
    statusText: "Ended"
  },
  {
    id: "SERIES-60574",
    externalId: "60574",
    type: "SERIES",
    title: "Peaky Blinders",
    originalTitle: "Peaky Blinders",
    posterUrl: "https://image.tmdb.org/t/p/w780/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/w1280/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
    releaseDate: "2013-09-12",
    overview: "A gangster family epic set in 1919 Birmingham, England and centered on a gang who sew razor blades in the peaks of their caps, and their fierce boss Tommy Shelby, who means to move up in the world.",
    genres: ["Crime", "Drama", "History"],
    score: 8.8,
    votes: 620000,
    country: "UK",
    audioLanguage: "BOTH",
    episodes: 36,
    seasons: 6,
    runtime: "60 min / ep",
    studioOrDeveloper: "BBC / Caryn Mandabach",
    trailerUrl: "https://www.youtube.com/watch?v=oVzVdvGIC7U",
    sourceUrl: "https://www.imdb.com/title/tt2442560/",
    statusText: "Ended"
  }
];

function transformTmdbItem(item: any, type: "MOVIE" | "SERIES"): UnifiedMediaItem {
  const isMovie = type === "MOVIE";
  const originCountry = item.origin_country?.[0] || item.production_countries?.[0]?.iso_3166_1 || "USA";
  const countryName = originCountry === "US" ? "USA" : originCountry === "JP" ? "Japan" : originCountry === "KR" ? "South Korea" : originCountry === "GB" ? "UK" : originCountry === "FR" ? "France" : originCountry === "DE" ? "Germany" : originCountry === "IN" ? "India" : originCountry === "ES" ? "Spain" : originCountry;

  return {
    id: `${type}-${item.id}`,
    externalId: String(item.id),
    type,
    title: isMovie ? item.title || item.original_title : item.name || item.original_name,
    originalTitle: isMovie ? item.original_title : item.original_name,
    posterUrl: item.poster_path ? `${TMDB_IMAGE_BASE}${item.poster_path}` : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=780&auto=format&fit=crop&q=80",
    backdropUrl: item.backdrop_path ? `${TMDB_BACKDROP_BASE}${item.backdrop_path}` : undefined,
    releaseDate: isMovie ? item.release_date : item.first_air_date,
    overview: item.overview || "No overview available.",
    genres: (item.genres || []).map((g: any) => g.name || g),
    score: item.vote_average ? Math.round(item.vote_average * 10) / 10 : undefined,
    votes: item.vote_count,
    country: countryName,
    audioLanguage: "BOTH",
    episodes: item.number_of_episodes || undefined,
    seasons: item.number_of_seasons || undefined,
    runtime: item.runtime ? `${item.runtime} min` : (item.episode_run_time?.[0] ? `${item.episode_run_time[0]} min / ep` : undefined),
    studioOrDeveloper: item.production_companies?.[0]?.name,
    trailerUrl: item.videos?.results?.find((v: any) => v.site === "YouTube" && v.type === "Trailer")
      ? `https://www.youtube.com/watch?v=${item.videos.results.find((v: any) => v.site === "YouTube" && v.type === "Trailer").key}`
      : undefined,
    sourceUrl: item.imdb_id ? `https://www.imdb.com/title/${item.imdb_id}/` : undefined,
    statusText: item.status
  };
}

export function filterAndSortMedia(
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

  // Country filter (Flexible matching across country variants)
  if (options.country && options.country !== "ALL") {
    const c = options.country.toLowerCase().trim();
    filtered = filtered.filter((i) => {
      if (!i.country) return false;
      const itemC = i.country.toLowerCase();
      if (c === "usa") return itemC === "usa" || itemC.includes("united states") || itemC === "us";
      if (c === "uk") return itemC === "uk" || itemC.includes("united kingdom") || itemC === "gb";
      if (c.includes("korea")) return itemC.includes("korea");
      return itemC.includes(c) || c.includes(itemC);
    });
  }

  // Audio Dub/Sub filter
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

export async function fetchTrendingMovies(): Promise<UnifiedMediaItem[]> {
  const localMovies = FALLBACK_MOVIES.filter(m => m.type === "MOVIE");
  if (!TMDB_API_KEY) {
    return localMovies;
  }
  try {
    const res = await fetch(`${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return localMovies;
    const data = await res.json();
    const fetched = (data.results || []).map((i: any) => transformTmdbItem(i, "MOVIE"));
    const combined = [...fetched, ...localMovies];
    const seen = new Set<string>();
    return combined.filter(m => {
      if (seen.has(m.title.toLowerCase())) return false;
      seen.add(m.title.toLowerCase());
      return true;
    });
  } catch (err) {
    return localMovies;
  }
}

export async function fetchTrendingShows(): Promise<UnifiedMediaItem[]> {
  const localShows = FALLBACK_MOVIES.filter(m => m.type === "SERIES");
  if (!TMDB_API_KEY) {
    return localShows;
  }
  try {
    const res = await fetch(`${TMDB_BASE_URL}/trending/tv/week?api_key=${TMDB_API_KEY}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return localShows;
    const data = await res.json();
    const fetched = (data.results || []).map((i: any) => transformTmdbItem(i, "SERIES"));
    const combined = [...fetched, ...localShows];
    const seen = new Set<string>();
    return combined.filter(m => {
      if (seen.has(m.title.toLowerCase())) return false;
      seen.add(m.title.toLowerCase());
      return true;
    });
  } catch (err) {
    return localShows;
  }
}

export async function searchMoviesAndShows(query: string): Promise<UnifiedMediaItem[]> {
  if (!query.trim()) return [...FALLBACK_MOVIES];

  // Search OMDb / IMDb live
  let omdbItems: UnifiedMediaItem[] = [];
  try {
    const omdbRes = await searchOmdb(query);
    omdbItems = omdbRes.items;
  } catch (err) {
    console.error("OMDb search error:", err);
  }

  // Filter local database as well
  const localMatches = filterAndSortMedia(FALLBACK_MOVIES, { query });

  // Merge results, giving priority to exact local matches then live OMDb items
  const combined = [...omdbItems, ...localMatches];
  const seen = new Set<string>();
  const uniqueItems = combined.filter((m) => {
    const key = (m.externalId || m.title).toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return filterAndSortMedia(uniqueItems, { query });
}

export async function getMovieOrShowById(type: "MOVIE" | "SERIES", id: string): Promise<UnifiedMediaItem | null> {
  // If it's an IMDb ID or has 'imdb-' or 'tt' prefix, fetch from OMDb immediately
  if (id.startsWith("imdb-") || id.startsWith("tt") || id.includes("tt")) {
    const omdbItem = await getOmdbMediaById(id);
    if (omdbItem) return omdbItem;
  }

  // Check fallback movies list
  const fallback = FALLBACK_MOVIES.find(
    m => (m.externalId === id || m.id === id || m.id === `${type}-${id}` || m.id === `imdb-${id}`)
  );
  if (fallback) return fallback;

  // Try live OMDb by ID
  const omdbFallback = await getOmdbMediaById(id);
  if (omdbFallback) return omdbFallback;

  if (!TMDB_API_KEY) {
    return null;
  }
  const endpoint = type === "MOVIE" ? "movie" : "tv";
  try {
    const res = await fetch(`${TMDB_BASE_URL}/${endpoint}/${id}?api_key=${TMDB_API_KEY}&append_to_response=videos,credits`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return transformTmdbItem(data, type);
  } catch (err) {
    return null;
  }
}

