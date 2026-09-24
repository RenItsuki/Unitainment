"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Film, Tv, Gamepad2, Star, Loader2 } from "lucide-react";
import { UnifiedMediaItem, MediaType } from "@/types";
import { getOptimizedImageUrl, getFallbackPlaceholder } from "@/lib/imageHelper";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "movies" | "anime" | "games">("all");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UnifiedMediaItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or focus
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Search execution with debounce
  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`/api/media?q=${encodeURIComponent(query)}&type=${typeFilter}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, typeFilter, isOpen]);

  if (!isOpen) return null;

  const handleSelectMedia = (item: UnifiedMediaItem) => {
    onClose();
    router.push(`/media/${item.type.toLowerCase()}/${item.externalId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-[#0d1322] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Movies, Shows, Anime (MAL), or Games..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-slate-950/40 overflow-x-auto text-xs">
          {[
            { id: "all", label: "All Entertainment" },
            { id: "movies", label: "Movies & TV" },
            { id: "anime", label: "Anime (MAL)" },
            { id: "games", label: "Games" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setTypeFilter(cat.id as any)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                typeFilter === cat.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {results.length > 0 ? (
            results.map((item) => {
              const isMovie = item.type === "MOVIE" || item.type === "SERIES";
              const isAnime = item.type === "ANIME";
              const isGame = item.type === "GAME";

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectMedia(item)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <img
                    src={getOptimizedImageUrl(item.posterUrl, item.type)}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      if (!target.src.includes("/api/image-proxy") && item.posterUrl && !item.posterUrl.startsWith("/")) {
                        target.src = `/api/image-proxy?url=${encodeURIComponent(item.posterUrl)}`;
                      } else {
                        target.src = getFallbackPlaceholder(item.type);
                      }
                    }}
                    className="w-12 h-16 rounded-lg object-cover bg-slate-800 shrink-0 border border-white/10 group-hover:border-cyan-500/50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h4>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                        isMovie ? "bg-blue-500/20 text-blue-300 border-blue-500/30" :
                        isAnime ? "bg-pink-500/20 text-pink-300 border-pink-500/30" :
                        "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      }`}>
                        {item.type}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {item.overview}
                    </p>

                    <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                      {item.score && (
                        <span className="flex items-center gap-1 text-amber-400 font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          {item.score}
                        </span>
                      )}
                      {item.releaseDate && <span>{item.releaseDate}</span>}
                      {item.genres?.length > 0 && (
                        <span className="truncate max-w-[200px]">
                          {item.genres.slice(0, 3).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : query.trim() && !loading ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No entertainment results found for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <div className="py-10 text-center text-slate-500 text-xs">
              Type keywords to search across millions of Movies, Anime, and Games simultaneously.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
