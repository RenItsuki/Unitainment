"use client";

import React from "react";

export function MediaCardSkeleton() {
  return (
    <div className="rounded-2xl glass-card overflow-hidden flex flex-col h-full border border-white/5 animate-pulse">
      {/* Poster Placeholder with subtle gradient shimmer */}
      <div className="relative aspect-[2/3] w-full bg-gradient-to-br from-slate-900 via-slate-800/70 to-[#0e1628] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_2s_infinite]" />
        
        {/* Top badge placeholders */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div className="w-16 h-5 rounded-md bg-white/10" />
          <div className="w-10 h-5 rounded-md bg-white/10" />
        </div>
      </div>

      {/* Info Placeholders */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-[#0b101c]/90 space-y-3">
        <div className="space-y-2">
          {/* Title line */}
          <div className="h-4 w-4/5 rounded bg-gradient-to-r from-slate-700/60 to-slate-800/40" />
          {/* Meta line */}
          <div className="flex items-center gap-2">
            <div className="h-3 w-10 rounded bg-slate-800/80" />
            <div className="h-3 w-16 rounded bg-slate-800/80" />
          </div>
        </div>

        {/* Studio / dev line */}
        <div className="h-2.5 w-1/2 rounded bg-slate-800/60" />
      </div>
    </div>
  );
}

export function MediaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ForumThreadSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass-card rounded-2xl p-5 border border-white/5 space-y-3 animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-20 h-5 rounded-full bg-white/10" />
              <div className="w-32 h-3 rounded bg-slate-800" />
            </div>
            <div className="w-12 h-4 rounded bg-slate-800" />
          </div>

          <div className="h-5 w-3/4 rounded bg-gradient-to-r from-slate-700/50 to-slate-800/50" />
          <div className="h-3.5 w-full rounded bg-slate-800/40" />
        </div>
      ))}
    </div>
  );
}

export function LiveChatSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-start gap-3 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-slate-800 shrink-0 border border-white/5" />
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-24 h-3.5 rounded bg-slate-700/60" />
              <div className="w-12 h-2.5 rounded bg-slate-800" />
            </div>
            <div className="h-4 w-4/5 rounded bg-gradient-to-r from-slate-800/80 to-slate-900/60" />
          </div>
        </div>
      ))}
    </div>
  );
}
