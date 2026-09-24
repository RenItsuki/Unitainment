"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  BookmarkCheck, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  Trash2, 
  Star, 
  Film, 
  Tv, 
  Gamepad2, 
  Loader2, 
  UserPlus 
} from "lucide-react";
import { UserListRecord, ListStatus } from "@/types";
import { AuthModal } from "@/components/AuthModal";

const TABS: { id: ListStatus | "ALL"; label: string; icon: any }[] = [
  { id: "ALL", label: "All Titles", icon: BookmarkCheck },
  { id: "PLAN_TO_WATCH", label: "Plan to Watch / Play", icon: Clock },
  { id: "WATCHING", label: "Watching / Playing", icon: PlayCircle },
  { id: "COMPLETED", label: "Completed", icon: CheckCircle2 },
];

export default function LibraryPage() {
  const { data: session, status: authStatus } = useSession();
  const [entries, setEntries] = useState<UserListRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ListStatus | "ALL">("ALL");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<string>("ALL");
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const fetchLibrary = async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      let url = "/api/library";
      const params = new URLSearchParams();
      if (activeTab !== "ALL") params.append("status", activeTab);
      if (mediaTypeFilter !== "ALL") params.append("type", mediaTypeFilter);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      }
    } catch (err) {
      console.error("Failed to fetch library:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, [session, activeTab, mediaTypeFilter]);

  const handleDeleteEntry = async (id: string) => {
    try {
      const res = await fetch(`/api/library?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEntries((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };

  const handleUpdateStatus = async (entry: UserListRecord, newStatus: ListStatus) => {
    try {
      const res = await fetch("/api/library", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          externalId: entry.mediaItem.externalId,
          type: entry.mediaItem.type,
          title: entry.mediaItem.title,
          posterUrl: entry.mediaItem.posterUrl,
          status: newStatus,
          progress: entry.progress,
        }),
      });
      if (res.ok) {
        fetchLibrary();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (authStatus === "loading") {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-xl">
          <BookmarkCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white">Your Entertainment Library</h1>
        <p className="text-sm text-slate-400 leading-relaxed">
          Sign in to organize your entertainment life. Save movies, anime, and games to Plan to Watch, track in-progress episodes, and mark titles as completed.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Sign In / Demo Login</span>
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BookmarkCheck className="w-4 h-4" />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="text-3xl font-black text-white">My Entertainment Library</h1>
        </div>

        {/* Media Type Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
          {[
            { id: "ALL", label: "All Media" },
            { id: "MOVIE", label: "Movies" },
            { id: "SERIES", label: "Series" },
            { id: "ANIME", label: "Anime" },
            { id: "GAME", label: "Games" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setMediaTypeFilter(type.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                mediaTypeFilter === type.id
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {isActive && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-400 text-slate-950 font-black">
                  {entries.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Library Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      ) : entries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {entries.map((entry) => {
            const item = entry.mediaItem;
            const detailUrl = `/media/${item.type.toLowerCase()}/${item.externalId}`;

            return (
              <div
                key={entry.id}
                className="glass-card rounded-2xl p-4 border border-white/5 flex gap-4 group"
              >
                <Link href={detailUrl} className="shrink-0 w-20 aspect-[2/3] rounded-xl overflow-hidden bg-slate-800 border border-white/10">
                  <img
                    src={item.posterUrl || ""}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded uppercase bg-white/10 text-cyan-300">
                        {item.type}
                      </span>

                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                        title="Remove from Library"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <Link href={detailUrl} className="block mt-1">
                      <h3 className="font-bold text-sm text-white truncate hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                    </Link>

                    {item.score && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-amber-400 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{item.score}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-[11px]">
                    <select
                      value={entry.status}
                      onChange={(e) => handleUpdateStatus(entry, e.target.value as ListStatus)}
                      className="bg-slate-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-full"
                    >
                      <option value="PLAN_TO_WATCH">Plan to Watch/Play</option>
                      <option value="WATCHING">Watching/Playing</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="DROPPED">Dropped</option>
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-24 text-center space-y-4 glass-panel rounded-3xl border border-white/5">
          <BookmarkCheck className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No titles in this list yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse through Movies, Anime, or Games and click &ldquo;Add to Library&rdquo; to start tracking.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/movies"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-colors"
            >
              Browse Movies
            </Link>
            <Link
              href="/anime"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 transition-colors"
            >
              Browse Anime
            </Link>
            <Link
              href="/games"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
            >
              Browse Games
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
