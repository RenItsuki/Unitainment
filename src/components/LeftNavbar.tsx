"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  Film, 
  Tv, 
  Gamepad2, 
  MessageSquare, 
  Radio, 
  Home, 
  BookmarkCheck, 
  User, 
  LogOut, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Heart
} from "lucide-react";
import { AuthModal } from "@/components/AuthModal";

export function LeftNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // The primary navigation items requested by the user
  const mainNavItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      exact: true,
      color: "from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/40",
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      href: "/movies",
      label: "Movies & TV",
      badge: "IMDb",
      sublabel: "Cinema, Series & Ratings",
      icon: Film,
      color: "from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/40",
      iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      match: (p: string) => p.startsWith("/movies") || p.startsWith("/media/movie") || p.startsWith("/media/series"),
    },
    {
      href: "/anime",
      label: "Anime & Manga",
      badge: "MAL",
      sublabel: "MyAnimeList Airing & Top",
      icon: Tv,
      color: "from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/40",
      iconColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
      match: (p: string) => p.startsWith("/anime") || p.startsWith("/media/anime"),
    },
    {
      href: "/games",
      label: "Video Games",
      badge: "Steam",
      sublabel: "PC, Steam Deck & Store",
      icon: Gamepad2,
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/40",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      match: (p: string) => p.startsWith("/games") || p.startsWith("/media/game"),
    },
    {
      href: "/forum",
      label: "Community Forums",
      badge: "Forms",
      sublabel: "Debates, Theories & Reviews",
      icon: MessageSquare,
      color: "from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/40",
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      match: (p: string) => p.startsWith("/forum"),
    },
    {
      href: "/chat",
      label: "Live Chat Lounge",
      badge: "Live",
      pulse: true,
      sublabel: "Real-time Lounge Channels",
      icon: Radio,
      color: "from-amber-500/20 to-emerald-500/20 text-emerald-300 border-emerald-500/40",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      match: (p: string) => p.startsWith("/chat"),
    },
    {
      href: "/donate",
      label: "Support Project",
      badge: "Donate",
      sublabel: "Fuel Server & Development",
      icon: Heart,
      color: "from-rose-500/20 to-pink-500/20 text-rose-300 border-rose-500/40",
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      match: (p: string) => p.startsWith("/donate"),
    },
  ];

  return (
    <>
      <aside className="w-64 lg:w-72 shrink-0 hidden md:flex flex-col fixed inset-y-0 left-0 z-40 bg-[#070b13]/95 backdrop-blur-2xl border-r border-white/10 shadow-2xl">
        {/* Top Logo Brand */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-white/10 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/15 shadow-lg shadow-cyan-500/20 shrink-0 group-hover:scale-105 transition-transform bg-[#080c14]">
              <img
                src="/logo.png"
                alt="Unitainment Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
                UNITAINMENT
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                ONE PLATFORM. ALL STORIES.
              </span>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Main Hub Section */}
          <div className="space-y-1.5">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              Entertainment Hubs
            </span>

            <div className="space-y-1.5 pt-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : item.match
                  ? item.match(pathname)
                  : pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center justify-between p-2.5 rounded-2xl border transition-all duration-200 ${
                      isActive
                        ? `bg-gradient-to-r ${item.color} shadow-lg shadow-black/40 font-bold`
                        : "bg-white/[0.02] hover:bg-white/[0.06] border-white/5 hover:border-white/10 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105 ${item.iconColor}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs truncate text-white">
                            {item.label}
                          </span>
                        </div>
                        {item.sublabel && (
                          <p className="text-[10px] text-slate-400 truncate">
                            {item.sublabel}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-1">
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase border ${
                          item.badge === "Live" 
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 animate-pulse" 
                            : "bg-slate-900/90 text-slate-400 border-white/10"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.pulse && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Personal Library Section */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <span className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
              My Tracking
            </span>

            <div className="space-y-1 pt-1">
              <Link
                href="/library"
                className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold border transition-all ${
                  pathname === "/library"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30 font-bold"
                    : "text-slate-300 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookmarkCheck className="w-4 h-4 text-cyan-400" />
                  <span>My Library</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                  Watch/Play
                </span>
              </Link>
            </div>
          </div>

          {/* Steam API Connected Widget */}
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-extrabold text-white">Steam API Connected</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Steam featured games, live concurrent players & store details synced.
            </p>
          </div>
        </div>

        {/* Bottom User Profile Dock */}
        <div className="p-4 border-t border-white/10 bg-slate-950/60 shrink-0">
          {session?.user ? (
            <div className="flex items-center justify-between gap-3">
              <Link href="/profile" className="flex items-center gap-2.5 min-w-0 group flex-1">
                <img
                  src={session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.name || "user"}`}
                  alt={session.user.name || "User"}
                  className="w-9 h-9 rounded-xl border border-cyan-500/40 object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition-colors">
                    {session.user.name}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {session.user.email}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 rounded-xl transition-all shadow-md active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
              <Link
                href="/login"
                className="w-full text-center text-[10px] text-slate-400 hover:text-cyan-400 transition-colors py-0.5"
              >
                Open Full Login Page →
              </Link>
            </div>
          )}
        </div>
      </aside>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
