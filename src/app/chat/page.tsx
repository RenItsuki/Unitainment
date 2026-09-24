"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { 
  Radio, 
  Send, 
  Film, 
  Tv, 
  Gamepad2, 
  Globe, 
  Loader2, 
  User 
} from "lucide-react";
import { ChatMessageRecord } from "@/types";
import { AuthModal } from "@/components/AuthModal";

const CHANNELS = [
  { id: "global", label: "global-lounge", icon: Globe, desc: "General entertainment banter" },
  { id: "movies", label: "movies-and-tv", icon: Film, desc: "Box office, Oscars & TV theories" },
  { id: "anime", label: "anime-corner", icon: Tv, desc: "Seasonal MAL releases & manga" },
  { id: "games", label: "gamers-den", icon: Gamepad2, desc: "PC, Console & competitive gaming" },
];

export default function ChatPage() {
  const { data: session } = useSession();
  const [currentChannel, setCurrentChannel] = useState("global");
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch(`/api/chat?channel=${currentChannel}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to load chat messages:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Initial fetch on channel switch
  useEffect(() => {
    fetchMessages(true);
  }, [currentChannel]);

  // Polling loop for live updates every 3.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentChannel]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user) {
      setAuthModalOpen(true);
      return;
    }
    if (!inputText.trim()) return;

    setSending(true);
    const msgToSend = inputText.trim();
    setInputText("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: currentChannel,
          message: msgToSend,
        }),
      });

      if (res.ok) {
        fetchMessages(false);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const activeChannelConfig = CHANNELS.find((c) => c.id === currentChannel) || CHANNELS[0];
  const ChannelIcon = activeChannelConfig.icon;

  return (
    <div className="py-4 space-y-4">
      {/* Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-[#080c14] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Community Live Lounge</span>
          </div>
          <h1 className="text-2xl font-black text-white">Realtime Entertainment Chat</h1>
        </div>
        <div className="text-xs text-slate-400">
          Chat live with movie buffs, otaku, and gamers around the world.
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="h-[650px] rounded-3xl glass-panel border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Left Channel Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-slate-950/40 p-4 shrink-0 flex flex-row md:flex-col justify-between overflow-x-auto">
          <div className="space-y-1 w-full">
            <span className="hidden md:block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 px-2">
              Lounge Rooms
            </span>

            <div className="flex md:flex-col gap-1 w-full">
              {CHANNELS.map((ch) => {
                const Icon = ch.icon;
                const isSelected = currentChannel === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setCurrentChannel(ch.id)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap text-left transition-all w-full ${
                      isSelected
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <div className="truncate">
                      <div>#{ch.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Messages Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0a0f1d]/70">
          {/* Channel Header Bar */}
          <div className="px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/30">
            <div className="flex items-center gap-2.5">
              <ChannelIcon className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-sm text-white">#{activeChannelConfig.label}</span>
              <span className="text-xs text-slate-400 hidden sm:inline">• {activeChannelConfig.desc}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold">Live</span>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
              </div>
            ) : messages.length > 0 ? (
              messages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 group">
                  <img
                    src={msg.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.user.name || "user"}`}
                    alt={msg.user.name || "User"}
                    className="w-8 h-8 rounded-full border border-white/10 shrink-0 object-cover mt-0.5"
                  />
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">
                        {msg.user.name || "Community Member"}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 break-words leading-relaxed">
                      {msg.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-2 text-slate-500">
                <ChannelIcon className="w-10 h-10 stroke-1" />
                <p className="text-xs">No messages yet in #{activeChannelConfig.label}. Say hello!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Bar */}
          <div className="p-4 border-t border-white/10 bg-slate-950/60">
            <form onSubmit={handleSendMessage} className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message #${activeChannelConfig.label}...`}
                className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={sending || !inputText.trim()}
                className="p-2.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 disabled:opacity-40 transition-all shadow-md active:scale-95"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        </div>
      </div>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
}
