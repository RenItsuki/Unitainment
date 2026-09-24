"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { 
  MessageSquare, 
  Plus, 
  MessageCircle, 
  Eye, 
  Film, 
  Tv, 
  Gamepad2, 
  Sparkles, 
  Loader2, 
  X 
} from "lucide-react";
import { ForumThreadRecord } from "@/types";
import { AuthModal } from "@/components/AuthModal";

const BOARDS = [
  { id: "ALL", label: "All Discussions", icon: Sparkles, color: "text-cyan-400" },
  { id: "GENERAL", label: "General Lounge", icon: MessageSquare, color: "text-purple-400" },
  { id: "MOVIES", label: "Movies & Shows", icon: Film, color: "text-blue-400" },
  { id: "ANIME", label: "Anime & Manga", icon: Tv, color: "text-pink-400" },
  { id: "GAMES", label: "Gaming Hub", icon: Gamepad2, color: "text-emerald-400" },
];

export default function ForumPage() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState<ForumThreadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBoard, setActiveBoard] = useState("ALL");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // New thread form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const url = activeBoard === "ALL" ? "/api/forum" : `/api/forum?category=${activeBoard}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setThreads(data.threads || []);
      }
    } catch (err) {
      console.error("Failed to load threads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [activeBoard]);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setAuthModalOpen(true);
      return;
    }
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          content: content.trim(),
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      if (res.ok) {
        setTitle("");
        setContent("");
        setTags("");
        setCreateModalOpen(false);
        fetchThreads();
      }
    } catch (err) {
      console.error("Error creating thread:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-[#080c14] p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Community Discussion Boards</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Entertainment Forums</h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Debate cinematic endings, discuss weekly seasonal anime episodes, share game tips, and connect with fellow enthusiasts.
          </p>
        </div>

        <button
          onClick={() => {
            if (!session?.user) setAuthModalOpen(true);
            else setCreateModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-lg shadow-purple-500/25 active:scale-95 transition-all self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Thread</span>
        </button>
      </div>

      {/* Board Categories Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10">
        {BOARDS.map((board) => {
          const Icon = board.icon;
          const isActive = activeBoard === board.id;
          return (
            <button
              key={board.id}
              onClick={() => setActiveBoard(board.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white/10 text-white border border-white/20 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${board.color}`} />
              <span>{board.label}</span>
            </button>
          );
        })}
      </div>

      {/* Threads List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        </div>
      ) : threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((thread) => {
            const boardConfig = BOARDS.find((b) => b.id === thread.category) || BOARDS[1];
            const BoardIcon = boardConfig.icon;

            return (
              <Link
                key={thread.id}
                href={`/forum/${thread.id}`}
                className="block glass-card rounded-2xl p-5 border border-white/5 hover:border-white/20 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 ${boardConfig.color}`}>
                        <BoardIcon className="w-3 h-3" />
                        {boardConfig.label}
                      </span>

                      <span className="text-[11px] text-slate-500">
                        Posted by {thread.user?.name || "Member"} •{" "}
                        {new Date(thread.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {thread.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {thread.content}
                    </p>
                  </div>

                  {/* Reply and View Counts */}
                  <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-cyan-400" />
                      <span>{thread._count?.replies || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4 text-slate-500" />
                      <span>{thread.views}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 glass-panel rounded-3xl border border-white/5">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No discussions here yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Start the conversation by creating the first discussion thread in this category.
          </p>
          <button
            onClick={() => {
              if (!session?.user) setAuthModalOpen(true);
              else setCreateModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-colors shadow-lg shadow-purple-600/20"
          >
            Create First Thread
          </button>
        </div>
      )}

      {/* New Thread Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div 
            className="relative w-full max-w-xl p-6 rounded-2xl glass-panel border border-white/10 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Create New Discussion Thread</h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateThread} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Category Board
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="GENERAL">General Lounge</option>
                  <option value="MOVIES">Movies & Shows (IMDb)</option>
                  <option value="ANIME">Anime & Manga (MAL)</option>
                  <option value="GAMES">Gaming Lounge</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Topic Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Which ending of Attack on Titan felt most impactful?"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Body Content
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your discussion topic, analysis, or prompt..."
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma-separated, optional)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. anime, theories, manga, finale"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 shadow-md active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Publish Thread</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
