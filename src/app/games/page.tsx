import type { Metadata } from "next";
import { Gamepad2, ShieldCheck, Flame, Users } from "lucide-react";
import { fetchTrendingGames } from "@/lib/api/rawg";
import { fetchSteamFeaturedGames, getSteamCurrentPlayers } from "@/lib/api/steam";
import { CategoryExplorer } from "@/components/CategoryExplorer";

export const metadata: Metadata = {
  title: "Video Games - Steam Top Sellers & Popular Releases",
  description: "Explore trending PC and console video games with live Steam concurrent player counts, verified ratings, system requirements, and play status tracking.",
  alternates: {
    canonical: "/games",
  },
  openGraph: {
    title: "Video Games | Unitainment",
    description: "Explore trending PC and console video games with live Steam concurrent player counts.",
    url: "/games",
  },
};

export default async function GamesPage() {
  const [games, steamFeatured, cs2Players] = await Promise.all([
    fetchTrendingGames(1),
    fetchSteamFeaturedGames(),
    getSteamCurrentPlayers(730), // Counter-Strike 2 live player count via Steam API
  ]);

  const gameGenres = [
    "Steam",
    "PC Gaming",
    "Action",
    "RPG",
    "Open World",
    "Adventure",
    "Shooter",
    "Strategy",
    "Turn-Based",
    "Souls-like",
    "Fantasy",
    "Sci-Fi",
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-[#080c14] p-8 sm:p-10 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Steam Web API & RAWG Powered
            </span>
          </div>

          {/* Steam Live Status Badge */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 shadow-md">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold text-white">Steam API Online</span>
            <span className="text-[10px] text-slate-400">domain: renitsuki.in</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white">Video Games Lounge</h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          Explore featured titles from the Steam Store, track games across PC, PlayStation, Xbox, and Nintendo Switch. Search and filter by genre, country, and sort by ratings or release date.
        </p>

        {/* Live Steam Highlights Pill */}
        {cs2Players && (
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Live on Steam: Counter-Strike 2 has <strong className="text-white">{cs2Players.toLocaleString()}</strong> players online right now</span>
          </div>
        )}
      </div>

      {/* Explorer with Search, Filters & Skeletons */}
      <CategoryExplorer
        initialItems={games}
        mediaType="games"
        availableGenres={gameGenres}
        showAudioFilter={false}
        showCountryFilter={true}
        title="Video Games"
      />
    </div>
  );
}
