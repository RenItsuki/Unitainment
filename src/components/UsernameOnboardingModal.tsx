"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowRight,
  UserCheck,
  AlertCircle
} from "lucide-react";

export function UsernameOnboardingModal() {
  const { data: session, status, update } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusInfo, setStatusInfo] = useState<{
    available: boolean;
    message: string;
  } | null>(null);

  // Trigger modal when authenticated user has hasCustomUsername === false
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const user = session.user as any;
      // If user has not set a custom username yet, open prompt
      if (user.hasCustomUsername === false) {
        // Pre-fill suggestion from current username or name
        if (!username) {
          const suggestion = (user.username || user.name || "")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9_]/g, "")
            .slice(0, 15);
          if (suggestion) setUsername(suggestion);
        }
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [session, status]);

  // Debounced username availability check
  useEffect(() => {
    const clean = username.trim().toLowerCase();
    if (!clean || clean.length < 3) {
      setStatusInfo(null);
      setChecking(false);
      return;
    }

    setChecking(true);
    setErrorMsg(null);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(clean)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setStatusInfo({
          available: Boolean(data.available),
          message:
            data.message ||
            (data.available
              ? "Username is available!"
              : "This username is already taken. Please choose something else."),
        });
      } catch {
        setStatusInfo({
          available: true,
          message: "Username is available!",
        });
      } finally {
        setChecking(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [username]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const clean = username.trim().toLowerCase();
    if (!clean || clean.length < 3) {
      setErrorMsg("Username must be at least 3 characters long.");
      return;
    }

    if (statusInfo && !statusInfo.available) {
      setErrorMsg("This username is already taken. Please choose something else.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: clean }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Failed to set username.");
        setSubmitting(false);
        return;
      }

      // Update local session
      if (update) {
        await update();
      }
      setIsOpen(false);
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while saving username.");
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 mb-1 shadow-xl shadow-cyan-500/25">
            <UserCheck className="w-7 h-7 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>New Account Onboarding</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Choose Your Username
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Welcome to Unitainment! Please select your unique <span className="text-cyan-400 font-bold">@handle</span> so friends and community members can find your reviews and lists.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">
                Your Username <span className="text-cyan-400">*</span>
              </label>
              {checking && (
                <span className="text-[11px] text-cyan-400 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Checking...
                </span>
              )}
            </div>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                @
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className={`w-full bg-white/5 border rounded-xl pl-8 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  statusInfo
                    ? statusInfo.available
                      ? "border-emerald-500/80 focus:border-emerald-400 shadow-sm shadow-emerald-500/20"
                      : "border-rose-500/80 focus:border-rose-400 shadow-sm shadow-rose-500/20"
                    : "border-white/10 focus:border-cyan-500"
                }`}
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {statusInfo && (
                  statusInfo.available ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-in zoom-in-50" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 animate-in zoom-in-50" />
                  )
                )}
              </div>
            </div>

            {statusInfo && (
              <p className={`text-xs font-semibold flex items-center gap-1.5 ${
                statusInfo.available ? "text-emerald-400" : "text-rose-400"
              }`}>
                {statusInfo.message}
              </p>
            )}
            <p className="text-[11px] text-slate-400">
              Letters, numbers, and underscores only. 3–20 characters.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={submitting || checking || (statusInfo !== null && !statusInfo.available)}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Username...</span>
                </>
              ) : (
                <>
                  <span>Claim Username & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
            >
              Skip for now (you can change it anytime in Profile)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
