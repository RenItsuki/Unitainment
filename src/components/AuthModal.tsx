"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { 
  X, 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  AlertCircle,
  ArrowRight
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign in fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // Username check
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    available: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const clean = regUsername.trim().toLowerCase();
    if (!clean || clean.length < 3) {
      setUsernameStatus(null);
      setCheckingUsername(false);
      return;
    }

    setCheckingUsername(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(clean)}`, {
          cache: "no-store",
        });
        const data = await res.json();
        setUsernameStatus({
          available: Boolean(data.available),
          message:
            data.message ||
            (data.available
              ? "Username is available!"
              : "This username is already taken. Please choose something else."),
        });
      } catch {
        setUsernameStatus({
          available: true,
          message: "Username is available!",
        });
      } finally {
        setCheckingUsername(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [regUsername]);

  if (!isOpen) return null;

  const handleGoogleSignIn = () => {
    setLoading(true);
    setErrorMessage(null);
    signIn("google", { callbackUrl: window.location.href });
  };

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim() || !password) {
      setErrorMessage("Please enter your username/email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        identifier: identifier.trim(),
        password: password,
        redirect: false,
        callbackUrl: window.location.href,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else {
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Sign in failed.");
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regUsername.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (usernameStatus && !usernameStatus.available) {
      setErrorMessage("This username is already taken. Please choose something else.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername.trim(),
          email: regEmail.trim(),
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Account created! Signing you in...");

      // Automatically sign in
      const loginRes = await signIn("credentials", {
        identifier: regUsername.trim(),
        password: regPassword,
        redirect: false,
        callbackUrl: window.location.href,
      });

      if (loginRes?.error) {
        setMode("signin");
        setIdentifier(regUsername.trim());
        setLoading(false);
      } else {
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Registration failed.");
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signIn("demo-login", {
        username: "Joy Guest",
        redirect: false,
        callbackUrl: window.location.href,
      });
      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else {
        onClose();
        window.location.reload();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Demo login failed.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md p-6 overflow-hidden rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 mb-1 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === "signin" ? "Sign In to " : "Join "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">Unitainment</span>
          </h2>
          <p className="text-xs text-slate-400">
            Track movies, anime, and games with reviews and community discussions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-xl bg-white/5 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => { setMode("signin"); setErrorMessage(null); }}
            className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
              mode === "signin"
                ? "bg-cyan-500 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("register"); setErrorMessage(null); }}
            className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
              mode === "register"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-2.5 font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 text-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center py-0.5">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0f172a] px-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold absolute">
            or password login
          </span>
        </div>

        {/* Sign In Form */}
        {mode === "signin" && (
          <form onSubmit={handleCredentialsSignIn} className="space-y-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-300">Username or Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Your username or email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-300">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold text-slate-300">Choose Username</label>
                {checkingUsername && (
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> Checking...
                  </span>
                )}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">@</span>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose a username"
                  className={`w-full bg-white/5 border rounded-xl pl-7 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none ${
                    usernameStatus
                      ? usernameStatus.available
                        ? "border-emerald-500/80"
                        : "border-rose-500/80"
                      : "border-white/10 focus:border-purple-500"
                  }`}
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  {usernameStatus && (
                    usernameStatus.available ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    )
                  )}
                </div>
              </div>
              {usernameStatus && (
                <p className={`text-[10px] ${usernameStatus.available ? "text-emerald-400" : "text-rose-400"}`}>
                  {usernameStatus.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[11px] font-semibold text-slate-300">Password (min 6 chars)</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (usernameStatus !== null && !usernameStatus.available)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3 h-3" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Demo Fast Login Fallback */}
        <div className="pt-1 text-center">
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="text-[11px] text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>Or quick sign in as guest</span>
          </button>
        </div>
      </div>
    </div>
  );
}
