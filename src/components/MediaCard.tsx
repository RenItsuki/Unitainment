"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Film, Tv, Gamepad2, Info } from "lucide-react";
import { UnifiedMediaItem } from "@/types";
import { StatusSelector } from "@/components/StatusSelector";
import { getOptimizedImageUrl, getFallbackPlaceholder } from "@/lib/imageHelper";

interface MediaCardProps {
  item: UnifiedMediaItem;
}

export function MediaCard({ item }: MediaCardProps) {
  const isMovie = item.type === "MOVIE" || item.type === "SERIES";
  const isAnime = item.type === "ANIME";
  const isGame = item.type === "GAME";

  const fallback = getFallbackPlaceholder(item.type);
  const [imgSrc, setImgSrc] = useState<string>(() => getOptimizedImageUrl(item.posterUrl, item.type));
  const [hasTriedProxy, setHasTriedProxy] = useState(false);

  useEffect(() => {
    setImgSrc(getOptimizedImageUrl(item.posterUrl, item.type));
    setHasTriedProxy(false);
  }, [item.posterUrl, item.type]);

  const handleImageError = () => {
    if (!hasTriedProxy && item.posterUrl && !imgSrc.includes("/api/image-proxy") && !item.posterUrl.startsWith("/")) {
      setHasTriedProxy(true);
      setImgSrc(`/api/image-proxy?url=${encodeURIComponent(item.posterUrl)}`);
    } else {
      setImgSrc(fallback);
    }
  };

  const typeConfig = {
    MOVIE: { label: "IMDb Movie", icon: Film, color: "from-blue-500/80 to-cyan-500/80" },
    SERIES: { label: "IMDb Series", icon: Film, color: "from-cyan-500/80 to-teal-500/80" },
    ANIME: { label: "MAL Anime", icon: Tv, color: "from-purple-500/80 to-pink-500/80" },
    GAME: { label: "Steam Game", icon: Gamepad2, color: "from-emerald-500/80 to-teal-500/80" },
  }[item.type] || { label: item.type, icon: Info, color: "from-slate-600 to-slate-800" };

  const TypeIcon = typeConfig.icon;
  const detailUrl = `/media/${item.type.toLowerCase()}/${item.externalId}`;

  return (
    <div className="group relative rounded-2xl glass-card overflow-hidden flex flex-col h-full border border-white/5 hover:border-white/20 transition-all duration-300">
      {/* Poster Media Container */}
      <Link href={detailUrl} className="relative block aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={imgSrc}
          alt={item.title}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold text-white uppercase tracking-wider bg-gradient-to-r ${typeConfig.color} shadow-md shadow-black/40 backdrop-blur-md`}>
            <TypeIcon className="w-3 h-3" />
            {typeConfig.label}
          </span>

          {item.score !== undefined && item.score !== null && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-white bg-black/60 border border-white/10 backdrop-blur-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{item.score}</span>
            </span>
          )}
        </div>

        {/* Quick status selector on hover overlay */}
        <div 
          className="absolute bottom-2.5 left-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <StatusSelector mediaItem={item} />
        </div>
      </Link>

      {/* Card Details */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-[#0b101c]/90">
        <div>
          <Link href={detailUrl} className="block group-hover:text-cyan-400 transition-colors">
            <h3 className="font-bold text-sm text-white line-clamp-1">
              {item.title}
            </h3>
          </Link>

          <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
            {item.releaseDate && <span>{item.releaseDate.split("-")[0]}</span>}
            {item.genres && item.genres.length > 0 && (
              <>
                <span>•</span>
                <span className="truncate">{item.genres[0]}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
          {item.studioOrDeveloper && (
            <p className="text-[10px] text-slate-500 truncate max-w-[65%]">
              {item.studioOrDeveloper}
            </p>
          )}
          {item.avgPlaytime && (
            <span className="text-[10px] font-semibold text-emerald-400/90 ml-auto truncate">
              {item.avgPlaytime}
            </span>
          )}
          {item.runtime && !item.avgPlaytime && (
            <span className="text-[10px] font-semibold text-slate-400 ml-auto truncate">
              {item.runtime}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
