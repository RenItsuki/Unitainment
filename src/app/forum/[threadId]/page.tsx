"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  MessageCircle, 
  Send, 
  Eye, 
  Loader2, 
  User 
} from "lucide-react";
import { ForumThreadRecord, ForumReplyRecord } from "@/types";
import { AuthModal } from "@/components/AuthModal";

export default function ForumThreadPage() {
  const params = useParams();
  const threadId = params.threadId as string;
  const { data: session } = useSession();

  const [thread, setThread] = useState<(ForumThreadRecord & { replies: ForumReplyRecord[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const fetchThread = async () => {
    try {
      const res = await fetch(`/api/forum/${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setThread(data.thread);
      }
    } catch (err) {
      console.error("Failed to fetch thread:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (threadId) fetchThread();
  }, [threadId]);

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setAuthModalOpen(true);
      return;
    }
    if (!replyText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/forum/${threadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText.trim() }),
      });

      if (res.ok) {
        setReplyText("");
        fetchThread();
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Thread not found</h2>
        <Link href="/forum" className="text-xs text-cyan-400 hover:underline">
          Return to Forums
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Back button */}
      <div>
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discussion Boards</span>
        </Link>
      </div>

      {/* Main Thread Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={thread.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${thread.user.name || "user"}`}
              alt={thread.user.name || "Author"}
              className="w-10 h-10 rounded-full border border-purple-500/40 object-cover"
            />
            <div>
              <h4 className="text-sm font-bold text-white">{thread.user.name || "Community Member"}</h4>
              <span className="text-[11px] text-slate-400">
                Posted on{" "}
                {new Date(thread.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-bold border border-purple-500/20 uppercase text-[10px]">
              {thread.category}
            </span>
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{thread.views}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
            {thread.title}
          </h1>

          <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap">
            {thread.content}
          </div>
        </div>
      </div>

      {/* Replies Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            <span>Discussion Replies ({thread.replies?.length || 0})</span>
          </h3>
        </div>

        {thread.replies && thread.replies.length > 0 ? (
          thread.replies.map((reply) => (
            <div
              key={reply.id}
              className="glass-card rounded-2xl p-5 border border-white/5 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={reply.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${reply.user.name || "user"}`}
                    alt={reply.user.name || "User"}
                    className="w-7 h-7 rounded-full object-cover border border-white/10"
                  />
                  <span className="text-xs font-bold text-white">{reply.user.name || "Member"}</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {new Date(reply.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 pl-9 leading-relaxed whitespace-pre-wrap">
                {reply.content}
              </p>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs">
            No replies yet. Be the first to join the conversation!
          </div>
        )}
      </div>

      {/* Reply Input Box */}
      <div className="glass-panel rounded-2xl p-5 border border-white/10">
        <form onSubmit={handlePostReply} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Post a Reply
          </label>
          <textarea
            rows={3}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Share your perspective, argue a point, or add additional insight..."
            className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            required
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 font-bold text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 rounded-xl shadow-md active:scale-95 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{session?.user ? "Send Reply" : "Sign In & Reply"}</span>
            </button>
          </div>
        </form>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
