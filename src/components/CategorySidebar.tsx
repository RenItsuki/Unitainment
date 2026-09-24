"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Film, 
  Tv, 
  Gamepad2, 
  Layers, 
  Sparkles, 
  Flame, 
  TrendingUp, 
  BookmarkCheck, 
  ChevronRight 
} from "lucide-react";

export function CategorySidebar() {
  const pathname = usePathname();

  const categories = [
    {
      href: "/movies",
      label: "Movies & TV",
      badge: "IMDb",
      sublabel: "Cinema, Series & Ratings",
      icon: Film,
      activeColor: "from-blue-500/20 to-cyan-500/20 border-cyan-500/40 text-cyan-300",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      activeCheck: (p: string) => p.startsWith("/movies") || p.startsWith("/media/movie") || p.startsWith("/media/series"),
    },
    {
      href: "/anime",
      label: "Anime & Manga",
      badge: "MAL",
      sublabel: "MyAnimeList Top Airing",
      icon: Tv,
      activeColor: "from-purple-500/20 to-pink-500/20 border-pink-500/40 text-pink-300",
      iconColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      activeCheck: (p: string) => p.startsWith("/anime") || p.startsWith("/media/anime"),
    },
    {
      href: "/games",
      label: "Video Games",
      badge: "RAWG",
      sublabel: "PC, Console & Metascores",
      icon: Gamepad2,
      activeColor: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      activeCheck: (p: string) => p.startsWith("/games") || p.startsWith("/media/game"),
    },
  ];

  return (
    <aside className="w-64 shrink-0 space-y-4">
      {/* Primary Category Hub Card */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 border border-white/10 shadow-2xl sticky top-20 space-y-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Categories</span>
          </div>
          <h2 className="text-sm font-black text-white">Entertainment Hubs</h2>
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.activeCheck(pathname);

            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`group flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${cat.activeColor} shadow-lg shadow-black/40`
                    : "bg-white/[0.03] hover:bg-white/[0.07] border-white/5 hover:border-white/15 text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${cat.iconColor}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs truncate text-white">
                        {cat.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {cat.sublabel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-1">
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase bg-slate-900/90 border border-white/10 text-slate-400">
                    {cat.badge}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? "text-cyan-400 translate-x-0.5" : "text-slate-600 group-hover:translate-x-0.5"}`} />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Discovery Tags */}
        <div className="pt-2 border-t border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Trending Tags</span>
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Action", href: "/movies" },
              { label: "Anime Top", href: "/anime" },
              { label: "RPG Games", href: "/games" },
              { label: "Sci-Fi", href: "/movies" },
              { label: "Fantasy", href: "/anime" },
              { label: "Open World", href: "/games" },
            ].map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Quick My Library Link */}
        <div className="pt-2 border-t border-white/10">
          <Link
            href="/library"
            className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/15 border border-cyan-500/20 text-cyan-300 text-xs font-bold transition-all group"
          >
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-cyan-400" />
              <span>My Watch / Play List</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
