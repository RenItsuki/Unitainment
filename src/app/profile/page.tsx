"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  User, 
  BookmarkCheck, 
  CheckCircle2, 
  Clock, 
  Film, 
  Tv, 
  Gamepad2, 
  LogOut, 
  Loader2, 
  Award,
  Calendar,
  Edit3,
  X,
  Sparkles,
  Camera,
  AlertCircle,
  XCircle,
  Save
} from "lucide-react";
import { UserListRecord } from "@/types";
import { AuthModal } from "@/components/AuthModal";

const AVATAR_PRESETS = [
  "Joy",
  "Felix",
  "Luna",
  "Ren",
  "Cyber",
  "Nova",
  "Echo",
  "Astro",
];

interface UserProfileData {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  bio: string | null;
  image: string | null;
  createdAt?: string;
}

export default function ProfilePage() {
  const { data: session, status: authStatus, update: updateSession } = useSession();
  const [entries, setEntries] = useState<UserListRecord[]>([]);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editImage, setEditImage] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Username validation state during edit
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean;
    message: string;
  } | null>(null);

  // Fetch library entries and profile details
  useEffect(() => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetch("/api/library").then((r) => r.json()),
      fetch("/api/profile").then((r) => r.json()),
    ])
      .then(([libData, profData]) => {
        if (libData?.entries) setEntries(libData.entries);
        if (profData?.user) {
          setProfile(profData.user);
          setEditName(profData.user.name || "");
          setEditUsername(profData.user.username || "");
          setEditBio(profData.user.bio || "");
          setEditImage(profData.user.image || "");
        }
      })
      .catch((err) => console.error("Error loading profile:", err))
      .finally(() => setLoading(false));
  }, [session]);

  // Debounced check if username changed during edit
  useEffect(() => {
    const clean = editUsername.trim().toLowerCase();
    const currentClean = profile?.username?.trim().toLowerCase();

    // If username hasn't changed from current, no need to check
    if (!clean || clean === currentClean) {
      setUsernameStatus(null);
      setCheckingUsername(false);
      return;
    }

    if (clean.length < 3) {
      setUsernameStatus({
        available: false,
        message: "Username must be at least 3 characters.",
      });
      return;
    }

    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(clean)}`);
        const data = await res.json();
        setUsernameStatus({
          available: data.available,
          message: data.message,
        });
      } catch {
        setUsernameStatus(null);
      } finally {
        setCheckingUsername(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [editUsername, profile]);

  const handleOpenEdit = () => {
    setEditName(profile?.name || session?.user?.name || "");
    setEditUsername(profile?.username || (session?.user as any)?.username || "");
    setEditBio(profile?.bio || "Entertainment enthusiast");
    setEditImage(profile?.image || session?.user?.image || "");
    setCustomImageUrl("");
    setSaveError(null);
    setSaveSuccess(null);
    setUsernameStatus(null);
    setEditModalOpen(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    const cleanUsername = editUsername.trim().toLowerCase();
    if (!cleanUsername || cleanUsername.length < 3) {
      setSaveError("Username must be at least 3 characters.");
      return;
    }

    if (usernameStatus && !usernameStatus.available) {
      setSaveError("Username is already taken. Please choose another.");
      return;
    }

    setSaving(true);
    try {
      const finalImage = customImageUrl.trim() || editImage;

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          username: cleanUsername,
          bio: editBio.trim(),
          image: finalImage,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSaveError(data.error || "Failed to update profile.");
        setSaving(false);
        return;
      }

      setProfile(data.user);
      setSaveSuccess("Profile updated successfully!");

      if (updateSession) {
        await updateSession();
      }

      setTimeout(() => {
        setEditModalOpen(false);
        setSaving(false);
      }, 700);
    } catch (err: any) {
      setSaveError(err.message || "An unexpected error occurred.");
      setSaving(false);
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="max-w-md mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Sign In to View Profile</h2>
        <p className="text-xs text-slate-400">
          Track your entertainment progress, view badges, and manage your account.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-md active:scale-95"
        >
          Sign In / Create Account
        </button>
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      </div>
    );
  }

  const completedCount = entries.filter((e) => e.status === "COMPLETED").length;
  const inProgressCount = entries.filter((e) => e.status === "WATCHING").length;
  const planToWatchCount = entries.filter((e) => e.status === "PLAN_TO_WATCH").length;

  const moviesCount = entries.filter((e) => e.mediaItem.type === "MOVIE" || e.mediaItem.type === "SERIES").length;
  const animeCount = entries.filter((e) => e.mediaItem.type === "ANIME").length;
  const gamesCount = entries.filter((e) => e.mediaItem.type === "GAME").length;

  const currentDisplayName = profile?.name || session.user.name || "User";
  const currentUsername = profile?.username || (session.user as any)?.username;
  const currentImage = profile?.image || session.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentDisplayName)}`;
  const currentBio = profile?.bio || "Entertainment enthusiast exploring movies, anime, and games.";

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Profile Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative group shrink-0">
          <img
            src={currentImage}
            alt={currentDisplayName}
            className="w-24 h-24 rounded-2xl border-2 border-cyan-400/50 object-cover shadow-xl bg-slate-900"
          />
          <button
            onClick={handleOpenEdit}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-white transition-opacity"
            title="Change Avatar"
          >
            <Camera className="w-6 h-6 text-cyan-400" />
          </button>
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <Award className="w-3 h-3" />
              <span>Unitainment Explorer</span>
            </span>

            {currentUsername && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                @{currentUsername}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white truncate">{currentDisplayName}</h1>
          
          <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
            {currentBio}
          </p>

          <p className="text-[11px] text-slate-500">{session.user.email}</p>
        </div>

        {/* Action Buttons: Edit Profile & Sign Out */}
        <div className="flex sm:flex-col items-center gap-2.5 shrink-0">
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-colors active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Edit Your Profile</h2>
                  <p className="text-[11px] text-slate-400">Update your username, name, avatar, and bio</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{saveError}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>{saveSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Choose Avatar</label>
                <div className="flex items-center gap-3">
                  <img
                    src={customImageUrl.trim() || editImage}
                    alt="Preview"
                    className="w-14 h-14 rounded-2xl border-2 border-cyan-500/50 object-cover bg-slate-900 shrink-0"
                  />
                  <div className="flex-1">
                    <span className="text-[11px] text-slate-400 block mb-1.5">Pick a bot avatar seed:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {AVATAR_PRESETS.map((seed) => {
                        const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
                        const isSelected = editImage === avatarUrl && !customImageUrl;
                        return (
                          <button
                            key={seed}
                            type="button"
                            onClick={() => {
                              setEditImage(avatarUrl);
                              setCustomImageUrl("");
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-cyan-500 text-white shadow-sm"
                                : "bg-white/5 hover:bg-white/10 text-slate-300"
                            }`}
                          >
                            {seed}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <input
                    type="url"
                    placeholder="Or paste custom image URL (https://...)"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Username Field with Live Database Availability Check */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">
                    Username <span className="text-rose-400">*</span>
                  </label>
                  {checkingUsername && (
                    <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Checking availability...
                    </span>
                  )}
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    placeholder="e.g. JoyKarmakar"
                    className={`w-full bg-white/5 border rounded-xl pl-8 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                      usernameStatus
                        ? usernameStatus.available
                          ? "border-emerald-500/80 focus:border-emerald-400"
                          : "border-rose-500/80 focus:border-rose-400"
                        : "border-white/10 focus:border-cyan-500"
                    }`}
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {usernameStatus && (
                      usernameStatus.available ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      )
                    )}
                  </div>
                </div>

                {usernameStatus && (
                  <p className={`text-[11px] font-medium ${usernameStatus.available ? "text-emerald-400" : "text-rose-400"}`}>
                    {usernameStatus.message}
                  </p>
                )}
              </div>

              {/* Display Name Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your full or display name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              {/* Bio Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">About Me / Bio</label>
                  <span className="text-[10px] text-slate-500">{editBio.length}/300</span>
                </div>
                <textarea
                  rows={3}
                  maxLength={300}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Share your favorite genres, anime, games, or movies..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || checkingUsername || (usernameStatus !== null && !usernameStatus.available)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Titles</span>
            <BookmarkCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{entries.length}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{completedCount}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{inProgressCount}</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-white/5 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Plan to Watch/Play</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white">{planToWatchCount}</p>
        </div>
      </div>

      {/* Media Type Breakdown */}
      <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
        <h2 className="text-base font-bold text-white">Media Type Breakdown</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Movies & Shows</span>
              <p className="text-lg font-bold text-white">{moviesCount} saved</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Anime Series</span>
              <p className="text-lg font-bold text-white">{animeCount} saved</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400">Video Games</span>
              <p className="text-lg font-bold text-white">{gamesCount} saved</p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Link
            href="/library"
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Go to My Library →
          </Link>
        </div>
      </div>
    </div>
  );
}
