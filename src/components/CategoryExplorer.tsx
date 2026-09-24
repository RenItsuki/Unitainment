"use client";

import React, { useState, useEffect, useRef } from "react";
import { UnifiedMediaItem } from "@/types";
import { MediaCard } from "@/components/MediaCard";
import { FilterToolbar, FilterState } from "@/components/FilterToolbar";
import { MediaGridSkeleton } from "@/components/SkeletonLoader";
import { Pagination } from "@/components/Pagination";

interface CategoryExplorerProps {
  initialItems: UnifiedMediaItem[];
  mediaType: "movies" | "shows" | "anime" | "games";
  availableGenres?: string[];
  showAudioFilter?: boolean;
  showCountryFilter?: boolean;
  title: string;
}

const ITEMS_PER_PAGE = 10;

export function CategoryExplorer({
  initialItems,
  mediaType,
  availableGenres,
  showAudioFilter = true,
  showCountryFilter = true,
  title,
}: CategoryExplorerProps) {
  const [items, setItems] = useState<UnifiedMediaItem[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<FilterState>({
    query: "",
    genre: "ALL",
    country: "ALL",
    audio: "ALL",
    sort: "popular",
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 whenever filters change
  };

  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("type", mediaType);
        if (filters.query.trim()) params.set("q", filters.query.trim());
        if (filters.genre !== "ALL") params.set("genre", filters.genre);
        if (filters.country !== "ALL") params.set("country", filters.country);
        if (filters.audio !== "ALL") params.set("audio", filters.audio);
        if (filters.sort !== "popular") params.set("sort", filters.sort);

        const res = await fetch(`/api/media?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.results || []);
        }
      } catch (err) {
        console.error("Filter fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchFiltered();
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [filters, mediaType]);

  // 10 results at a time as requested by user
  const paginatedItems = items.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Search, Filter & Sort Toolbar */}
      <FilterToolbar
        filters={filters}
        onChange={handleFilterChange}
        availableGenres={availableGenres}
        showAudioFilter={showAudioFilter}
        showCountryFilter={showCountryFilter}
        totalCount={items.length}
      />

      {/* Grid of Results with 10 items at a time */}
      {loading ? (
        <MediaGridSkeleton count={ITEMS_PER_PAGE} />
      ) : items.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginatedItems.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>

          {/* Results Pagination: 10 per page */}
          <Pagination
            currentPage={currentPage}
            totalItems={items.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <div className="py-20 text-center space-y-3 glass-panel rounded-3xl border border-white/5">
          <p className="text-sm font-semibold text-slate-300">
            No {title.toLowerCase()} match your current search and filters.
          </p>
          <p className="text-xs text-slate-500">
            Try adjusting your genre, country, or keyword terms.
          </p>
          <button
            onClick={() =>
              handleFilterChange({
                query: "",
                genre: "ALL",
                country: "ALL",
                audio: "ALL",
                sort: "popular",
              })
            }
            className="px-4 py-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 rounded-xl border border-cyan-500/20"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
