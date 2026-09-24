"use client";

import React from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown, Globe, Volume2 } from "lucide-react";

export interface FilterState {
  query: string;
  genre: string;
  country: string;
  audio: string;
  sort: string;
}

interface FilterToolbarProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  availableGenres?: string[];
  showAudioFilter?: boolean; // useful for anime & foreign cinema
  showCountryFilter?: boolean;
  totalCount?: number;
}

const DEFAULT_GENRES = [
  "Action",
  "Adventure",
  "Sci-Fi",
  "Fantasy",
  "Drama",
  "Comedy",
  "Thriller",
  "Crime",
  "Mystery",
  "Horror",
  "Animation",
  "RPG",
  "Open World",
  "Shooter",
];

const COUNTRIES = [
  { id: "ALL", label: "All Countries" },
  { id: "USA", label: "USA" },
  { id: "Japan", label: "Japan" },
  { id: "South Korea", label: "South Korea" },
  { id: "UK", label: "United Kingdom" },
  { id: "Germany", label: "Germany" },
  { id: "Global", label: "Global / Multi" },
];

const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular / Trending" },
  { id: "rating_desc", label: "Highest Rated (★ 10-1)" },
  { id: "rating_asc", label: "Lowest Rated (★ 1-10)" },
  { id: "date_desc", label: "Newest Release / Air Date" },
  { id: "date_asc", label: "Classic / Oldest" },
];

export function FilterToolbar({
  filters,
  onChange,
  availableGenres = DEFAULT_GENRES,
  showAudioFilter = true,
  showCountryFilter = true,
  totalCount,
}: FilterToolbarProps) {
  const isFiltered =
    filters.query !== "" ||
    filters.genre !== "ALL" ||
    filters.country !== "ALL" ||
    filters.audio !== "ALL" ||
    filters.sort !== "popular";

  const handleReset = () => {
    onChange({
      query: "",
      genre: "ALL",
      country: "ALL",
      audio: "ALL",
      sort: "popular",
    });
  };

  return (
    <div className="space-y-3 glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xl">
      {/* Top Search Bar & Results Counter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
          <input
            type="text"
            value={filters.query}
            onChange={(e) => onChange({ ...filters, query: e.target.value })}
            placeholder="Search by title, character, or keywords..."
            className="w-full bg-slate-900/90 border border-white/10 rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {filters.query && (
            <button
              onClick={() => onChange({ ...filters, query: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {totalCount !== undefined && (
          <div className="text-xs text-slate-400 font-medium whitespace-nowrap self-end sm:self-auto px-2">
            Showing <span className="text-cyan-400 font-bold">{totalCount}</span> results
          </div>
        )}
      </div>

      {/* Filter Row: Genre, Country, Audio Dub/Sub, Sort */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-1 text-xs">
        {/* Genre Selector */}
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">
            Genre
          </label>
          <select
            value={filters.genre}
            onChange={(e) => onChange({ ...filters, genre: e.target.value })}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">All Genres</option>
            {availableGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Country Selector */}
        {showCountryFilter && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>Country</span>
            </label>
            <select
              value={filters.country}
              onChange={(e) => onChange({ ...filters, country: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              {COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Audio (Dub / Sub) Selector */}
        {showAudioFilter && (
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-purple-400" />
              <span>Dub / Sub</span>
            </label>
            <select
              value={filters.audio}
              onChange={(e) => onChange({ ...filters, audio: e.target.value })}
              className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Audio</option>
              <option value="SUB">Subtitled (SUB)</option>
              <option value="DUB">Dubbed (DUB)</option>
              <option value="BOTH">Dual Audio / Both</option>
            </select>
          </div>
        )}

        {/* Sort Selector */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1 flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-amber-400" />
            <span>Sort By</span>
          </label>
          <select
            value={filters.sort}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {isFiltered && (
          <div className="col-span-2 sm:col-span-4 lg:col-span-1 flex items-end">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
