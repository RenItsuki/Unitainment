"use client";

import React, { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { UnifiedMediaItem } from "@/types";
import { MediaCard } from "@/components/MediaCard";
import { FilterToolbar, FilterState } from "@/components/FilterToolbar";
import { MediaGridSkeleton } from "@/components/SkeletonLoader";
import { Pagination } from "@/components/Pagination";

interface HomeSearchSectionProps {
  initialMovies: UnifiedMediaItem[];
  initialAnime: UnifiedMediaItem[];
  initialGames: UnifiedMediaItem[];
}

const ITEMS_PER_PAGE = 10;

export function HomeSearchSection({
  initialMovies,
  initialAnime,
  initialGames,
}: HomeSearchSectionProps) {
  const [activeMediaTab, setActiveMediaTab] = useState<"all" | "movies" | "anime" | "games">("all");
  const [results, setResults] = useState<UnifiedMediaItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<FilterState>({
    query: "",
    genre: "ALL",
    country: "ALL",
    audio: "ALL",
    sort: "popular",
  });

  const isFilterActive =
    filters.query.trim() !== "" ||
    filters.genre !== "ALL" ||
    filters.country !== "ALL" ||
    filters.audio !== "ALL" ||
    filters.sort !== "popular" ||
    activeMediaTab !== "all";

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleTabChange = (tab: "all" | "movies" | "anime" | "games") => {
    setActiveMediaTab(tab);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (!isFilterActive) {
      setIsSearching(false);
      setResults([]);
      return;
    }

    setIsSearching(true);
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("type", activeMediaTab);
        if (filters.query.trim()) params.set("q", filters.query.trim());
        if (filters.genre !== "ALL") params.set("genre", filters.genre);
        if (filters.country !== "ALL") params.set("country", filters.country);
        if (filters.audio !== "ALL") params.set("audio", filters.audio);
        if (filters.sort !== "popular") params.set("sort", filters.sort);

        const res = await fetch(`/api/media?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (err) {
        console.error("Home search error:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [filters, activeMediaTab, isFilterActive]);

  const paginatedResults = results.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <section className="space-y-4">
      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-white/10 text-xs">
          {[
            { id: "all", label: "All Entertainment" },
            { id: "movies", label: "Movies & Shows" },
            { id: "anime", label: "Anime (MAL)" },
            { id: "games", label: "Games (Steam)" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                activeMediaTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Real-time Multi-API Search & Filters (10 per page)</span>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <FilterToolbar
        filters={filters}
        onChange={handleFilterChange}
        showAudioFilter={true}
        showCountryFilter={true}
        totalCount={isSearching ? results.length : undefined}
      />

      {/* Dynamic Results Display when Searching/Filtering */}
      {isSearching && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Filtered Entertainment Results</span>
            </h3>
            <button
              onClick={() => {
                setFilters({
                  query: "",
                  genre: "ALL",
                  country: "ALL",
                  audio: "ALL",
                  sort: "popular",
                });
                setActiveMediaTab("all");
                setCurrentPage(1);
              }}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              Close Filtered View
            </button>
          </div>

          {loading ? (
            <MediaGridSkeleton count={ITEMS_PER_PAGE} />
          ) : results.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedResults.map((item) => (
                  <MediaCard key={item.id} item={item} />
                ))}
              </div>

              {/* 10 results pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={results.length}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            </div>
          ) : (
            <div className="py-14 text-center glass-panel rounded-2xl border border-white/5 space-y-2">
              <p className="text-sm font-semibold text-slate-300">
                No titles match your filter criteria.
              </p>
              <p className="text-xs text-slate-500">
                Try clearing or loosening your genre, country, or keyword parameters.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
