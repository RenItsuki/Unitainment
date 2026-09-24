"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Bookmark, 
  Check, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  Loader2 
} from "lucide-react";
import { ListStatus, UnifiedMediaItem } from "@/types";
import { AuthModal } from "@/components/AuthModal";

interface StatusSelectorProps {
  mediaItem: UnifiedMediaItem;
  currentStatus?: ListStatus | null;
  onStatusChange?: (newStatus: ListStatus | null) => void;
  variant?: "button" | "dropdown" | "compact";
}

const STATUS_OPTIONS: { id: ListStatus; label: string; icon: any; color: string }[] = [
  { id: "PLAN_TO_WATCH", label: "Plan to Watch / Play", icon: Clock, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  { id: "WATCHING", label: "Watching / Playing", icon: PlayCircle, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  { id: "COMPLETED", label: "Completed", icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { id: "DROPPED", label: "Dropped / On Hold", icon: Bookmark, color: "text-rose-400 bg-rose-500/10 border-rose-500/30" },
];

export function StatusSelector({
  mediaItem,
  currentStatus: initialStatus = null,
  onStatusChange,
  variant = "button",
}: StatusSelectorProps) {
  const { data: session } = useSession();
  const [status, setStatus] = useState<ListStatus | null>(initialStatus);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleUpdateStatus = async (newStatus: ListStatus | null) => {
    if (!session?.user) {
      setAuthModalOpen(true);
      return;
    }

    setLoading(true);
    setStatus(newStatus);
    setDropdownOpen(false);

    try {
      if (newStatus === null) {
        // Remove from list
        // API will delete
      } else {
        const res = await fetch("/api/library", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            externalId: mediaItem.externalId,
            type: mediaItem.type,
            title: mediaItem.title,
            posterUrl: mediaItem.posterUrl,
            backdropUrl: mediaItem.backdropUrl,
            releaseDate: mediaItem.releaseDate,
            overview: mediaItem.overview,
            genres: mediaItem.genres,
            score: mediaItem.score,
            status: newStatus,
          }),
        });
        if (res.ok) {
          onStatusChange?.(newStatus);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
      // Revert if error
      setStatus(initialStatus);
    } finally {
      setLoading(false);
    }
  };

  const activeOption = STATUS_OPTIONS.find((o) => o.id === status);

  return (
    <>
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          disabled={loading}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeOption
              ? `${activeOption.color} shadow-lg shadow-black/30`
              : "bg-slate-900/90 text-slate-300 border-white/10 hover:border-white/25 hover:text-white"
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          ) : activeOption ? (
            <activeOption.icon className="w-4 h-4" />
          ) : (
            <Bookmark className="w-4 h-4 text-cyan-400" />
          )}

          <span>{activeOption ? activeOption.label : "Add to Library"}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {dropdownOpen && (
          <div 
            className="absolute left-0 mt-2 w-56 rounded-xl glass-panel border border-white/10 shadow-2xl z-50 py-1.5 animate-in fade-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/5">
              Set Tracking Status
            </div>

            {STATUS_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isSelected = status === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleUpdateStatus(opt.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                    isSelected
                      ? "bg-white/10 text-white font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${opt.color.split(" ")[0]}`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              );
            })}

            {status && (
              <div className="border-t border-white/5 mt-1 pt-1">
                <button
                  onClick={() => handleUpdateStatus(null)}
                  className="w-full px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 text-left transition-colors"
                >
                  Remove from Library
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}
