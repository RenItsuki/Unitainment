"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MessageSquarePlus, Star, ThumbsUp, Loader2 } from "lucide-react";
import { UnifiedMediaItem, ReviewRecord } from "@/types";
import { RatingStars } from "@/components/RatingStars";
import { AuthModal } from "@/components/AuthModal";

interface ReviewSectionProps {
  mediaItem: UnifiedMediaItem;
}

export function ReviewSection({ mediaItem }: ReviewSectionProps) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Form state
  const [rating, setRating] = useState<number>(8);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `/api/reviews?externalId=${encodeURIComponent(mediaItem.externalId)}&type=${mediaItem.type}`
      );
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [mediaItem.externalId, mediaItem.type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setAuthModalOpen(true);
      return;
    }

    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          externalId: mediaItem.externalId,
          type: mediaItem.type,
          title: mediaItem.title,
          posterUrl: mediaItem.posterUrl,
          rating,
          reviewTitle: title.trim(),
          content: content.trim(),
        }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        fetchReviews();
      }
    } catch (err) {
      console.error("Error posting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12 space-y-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-cyan-400" />
            <span>Community Reviews</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Read what other entertainment lovers think or leave your own verdict.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-white/10">
          {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}
        </span>
      </div>

      {/* Write a Review Box */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <span>Leave Your Rating & Review</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              Your Score (1 to 10)
            </label>
            <RatingStars value={rating} onChange={setRating} size="md" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Review Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Masterpiece in storytelling! Must watch/play"
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">
              Detailed Thoughts
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what worked, the highlights, pacing, visuals, gameplay, and overall impression..."
              className="w-full bg-slate-900/80 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 font-bold text-xs text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 rounded-xl shadow-lg shadow-cyan-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageSquarePlus className="w-4 h-4" />
              )}
              <span>{session?.user ? "Submit Review" : "Sign In & Submit"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reviews Feed */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="glass-card rounded-2xl p-5 border border-white/5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${rev.user.name || "user"}`}
                    alt={rev.user.name || "User"}
                    className="w-9 h-9 rounded-full object-cover border border-white/10"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{rev.user.name || "Community Member"}</h4>
                    <span className="text-[11px] text-slate-500">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{rev.rating}/10</span>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-sm text-slate-100">{rev.title}</h5>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed whitespace-pre-wrap">
                  {rev.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            No reviews yet for this title. Be the first to share your verdict!
          </div>
        )}
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
