"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const initialMode = searchParams.get("mode") === "register" ? "register" : "signin";

  const [mode, setMode] = useState<"signin" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign In State
  const [signInIdentifier, setSignInIdentifier] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Register State
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");

  // Username Availability State
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  } | null>(null);

  // Check username availability with debouncing
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
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(clean)}`);
        const data = await res.json();
        setUsernameStatus({
          checked: true,
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
  }, [regUsername]);

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    setLoading(true);
    setErrorMessage(null);
    signIn("google", { callbackUrl });
  };

  // Handle Standard Credentials Sign In
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!signInIdentifier.trim() || !signInPassword) {
      setErrorMessage("Please enter both your username/email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        identifier: signInIdentifier.trim(),
        password: signInPassword,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  // Handle User Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!regUsername.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (usernameStatus && !usernameStatus.available) {
      setErrorMessage("Please pick an available username before submitting.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
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
          name: regName.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      setSuccessMessage("Account created! Signing you in...");

      // Automatically sign in the newly registered user
      const loginRes = await signIn("credentials", {
        identifier: regUsername.trim(),
        password: regPassword,
        redirect: false,
        callbackUrl,
      });

      if (loginRes?.error) {
        // Fallback to signin mode if auto-login fails
        setMode("signin");
        setSignInIdentifier(regUsername.trim());
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during registration.");
      setLoading(false);
    }
  };

  // Handle Instant Demo Guest Sign In
  const handleDemoSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await signIn("demo-login", {
        username: "Joy Guest",
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setErrorMessage(res.error);
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Demo sign in failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 mb-1 shadow-lg shadow-cyan-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white">
            {mode === "signin" ? "Welcome Back to " : "Create Your "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Unitainment
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            {mode === "signin"
              ? "Sign in to access your universal watchlist, reviews & live community."
              : "Choose a unique username and password to join our entertainment hub."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 rounded-2xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === "signin"
                ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMessage(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === "register"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Notifications / Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Google One-Click Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 text-xs sm:text-sm"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-1">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0c1220] px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold absolute">
            or with credentials
          </span>
        </div>

        {/* Sign In Form */}
        {mode === "signin" && (
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Username or Email
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={signInIdentifier}
                  onChange={(e) => setSignInIdentifier(e.target.value)}
                  placeholder="Your username or email"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Unitainment</span>
              )}
            </button>
          </form>
        )}

        {/* Register Form */}
        {mode === "register" && (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Username Field with Live Database Availability Check */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Pick a Unique Username <span className="text-rose-400">*</span>
                </label>
                {checkingUsername && (
                  <span className="text-[10px] text-cyan-400 flex items-center gap-1 font-medium">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Checking database...
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
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="e.g. JoyKarmakar"
                  className={`w-full bg-white/5 border rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    usernameStatus
                      ? usernameStatus.available
                        ? "border-emerald-500/80 focus:border-emerald-400"
                        : "border-rose-500/80 focus:border-rose-400"
                      : "border-white/10 focus:border-purple-500"
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
                <p
                  className={`text-[11px] font-medium flex items-center gap-1 ${
                    usernameStatus.available ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {usernameStatus.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Create Password (min 6 characters) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Display Name (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Display Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="How you want to be called"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || (usernameStatus !== null && !usernameStatus.available)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm transition-all shadow-lg shadow-purple-600/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Instant Demo Account option */}
        <div className="pt-2 border-t border-white/10 text-center">
          <p className="text-[11px] text-slate-500 mb-2">Want to explore instantly without signing up?</p>
          <button
            type="button"
            onClick={handleDemoSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors active:scale-95"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Guest / Demo Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[75vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
