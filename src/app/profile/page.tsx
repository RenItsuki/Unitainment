"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  User, 
  BookmarkCheck, 
  CheckCircle2, 
  Clock, 
  Film, 
  Tv, 
  Gamepad2, 
  LogOut, 
  Loader2, 
  Award,
  Calendar
} from "lucide-react";
import { UserListRecord } from "@/types";
import { AuthModal } from "@/components/AuthModal";

export default function ProfilePage() {
  const { data: session, status: authStatus } = useSession();
  const [entries, setEntries] = useState<UserListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    fetch("/api/library")
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Sign In to View Profile</h2>
        <p className="text-xs text-slate-400">
          Track your entertainment progress, view badges, and manage your account.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
        >
          Sign In / Guest Login
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const completedCount = entries.filter((e) => e.status === "COMPLETED").length;
  const inProgressCount = entries.filter((e) => e.status === "WATCHING").length;
  const planToWatchCount = entries.filter((e) => e.status === "PLAN_TO_WATCH").length;

  const moviesCount = entries.filter((e) => e.mediaItem.type === "MOVIE" || e.mediaItem.type === "SERIES").length;
  const animeCount = entries.filter((e) => e.mediaItem.type === "ANIME").length;
  const gamesCount = entries.filter((e) => e.mediaItem.type === "GAME").length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Profile Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <img
          src={session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${session.user.name || "user"}`}
          alt={session.user.name || "User"}
          className="w-24 h-24 rounded-2xl border-2 border-cyan-400/50 object-cover shadow-xl"
        />

        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Award className="w-3 h-3" />
            <span>Unitainment Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{session.user.name}</h1>
          {(session.user as any)?.username && (
            <p className="text-xs font-bold text-cyan-400 font-mono">@{(session.user as any).username}</p>
          )}
          <p className="text-xs text-slate-400">{session.user.email}</p>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Titles</span>
            <BookmarkCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{entries.length}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{completedCount}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{inProgressCount}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Plan to Watch/Play</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{planToWatchCount}</p>
        </div>
      </div>

      {/* Media Type Breakdown */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white">Media Type Breakdown</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Movies & Shows</span>
              <p className="text-lg font-bold text-white">{moviesCount} saved</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Anime Series</span>
              <p className="text-lg font-bold text-white">{animeCount} saved</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Video Games</span>
              <p className="text-lg font-bold text-white">{gamesCount} saved</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            href="/library"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Go to My Library →
          </Link>
        </div>
      </div>
    </div>
  );
}
