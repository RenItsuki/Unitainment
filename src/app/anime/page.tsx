import type { Metadata } from "next";
import { Tv } from "lucide-react";
import { fetchTopAnime } from "@/lib/api/mal";
import { CategoryExplorer } from "@/components/CategoryExplorer";

export const metadata: Metadata = {
  title: "Anime & Manga - Top Ranked, Seasonal & Tracking",
  description: "Explore top anime series, seasonal broadcasts, and movies directly integrated with MyAnimeList. Track episodes, score favorites, and discover recommendations.",
  alternates: {
    canonical: "/anime",
  },
  openGraph: {
    title: "Anime & Manga | Unitainment",
    description: "Explore top anime series, seasonal broadcasts, and movies integrated with MyAnimeList.",
    url: "/anime",
  },
};

export default async function AnimePage() {
  const animeList = await fetchTopAnime(1);

  const animeGenres = [
    "Action",
    "Adventure",
    "Fantasy",
    "Drama",
    "Sci-Fi",
    "Supernatural",
    "Suspense",
    "Comedy",
    "Romance",
    "Slice of Life",
    "Shounen",
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/40 via-pink-950/20 to-[#080c14] p-8 sm:p-10 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
            <Tv className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
            MyAnimeList (MAL) Powered
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Anime & Manga Realm</h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl">
          Live MAL rankings, seasonal anime, and classic masterpieces. Filter by sub/dub audio, genre, country, and sort by score or air date.
        </p>
      </div>

      {/* Explorer with Search, Filters & Skeletons */}
      <CategoryExplorer
        initialItems={animeList}
        mediaType="anime"
        availableGenres={animeGenres}
        showAudioFilter={true}
        showCountryFilter={true}
        title="Anime"
      />
    </div>
  );
}
