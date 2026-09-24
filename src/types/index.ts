export type MediaType = "MOVIE" | "SERIES" | "ANIME" | "GAME";

export type ListStatus = "PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "ON_HOLD" | "DROPPED";

export interface UnifiedMediaItem {
  id: string; // our internal id or synthetic composite `${type}-${externalId}`
  externalId: string;
  type: MediaType;
  title: string;
  originalTitle?: string;
  posterUrl: string;
  backdropUrl?: string;
  releaseDate?: string;
  overview: string;
  genres: string[];
  score?: number; // 0-10 or 0-100 normalized to 0-10
  votes?: number;
  episodes?: number; // anime/series
  seasons?: number; // anime/series
  runtime?: string; // movies/series/anime duration
  avgPlaytime?: string; // games average playtime (e.g. "50 - 100 hrs")
  livePlayers?: number; // Steam live concurrent players
  price?: string; // game price or "Free to Play"
  platforms?: string[]; // games
  trailerUrl?: string;
  sourceUrl?: string; // link to IMDb, MAL, or Steam
  studioOrDeveloper?: string;
  statusText?: string; // e.g. "Currently Airing", "Released"
  country?: string; // e.g. "USA", "Japan", "South Korea", "UK"
  audioLanguage?: "SUB" | "DUB" | "BOTH"; // e.g. "SUB", "DUB", "BOTH"
  director?: string;
  writer?: string;
  actors?: string;
  awards?: string;
  rated?: string;
  boxOffice?: string;
  metascore?: string;
}

export interface UserListRecord {
  id: string;
  userId: string;
  mediaItemId: string;
  status: ListStatus;
  progress: number;
  rating?: number | null;
  favorite: boolean;
  updatedAt: string;
  mediaItem: UnifiedMediaItem;
}

export interface ReviewRecord {
  id: string;
  userId: string;
  mediaItemId: string;
  rating: number;
  title: string;
  content: string;
  likes: number;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

export interface ForumThreadRecord {
  id: string;
  userId: string;
  category: "GENERAL" | "MOVIES" | "ANIME" | "GAMES";
  title: string;
  content: string;
  tags?: string[];
  views: number;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count?: {
    replies: number;
  };
}

export interface ForumReplyRecord {
  id: string;
  threadId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export interface ChatMessageRecord {
  id: string;
  userId: string;
  channel: "global" | "movies" | "anime" | "games";
  message: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
