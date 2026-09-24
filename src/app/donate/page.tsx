"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Script from "next/script";
import { 
  Heart, 
  Coffee, 
  Sparkles, 
  Server, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  Users,
  Coins
} from "lucide-react";

interface DonationRecord {
  id: string;
  amount: number;
  currency: string;
  donorName: string | null;
  message: string | null;
  createdAt: string;
}

const PRESET_TIERS = [
  { amount: 50, label: "Cup of Chai", icon: "☕", desc: "Keep the servers caffeinated" },
  { amount: 150, label: "Snack Pack", icon: "🍿", desc: "A cozy anime & movie companion" },
  { amount: 300, label: "Server Booster", icon: "🚀", desc: "Helps cover high-speed API limits", popular: true },
  { amount: 500, label: "Super Patron", icon: "🌟", desc: "Directly fuels new feature development" },
  { amount: 1000, label: "Executive Legend", icon: "👑", desc: "Hall of fame supporter badge" },
];

export default function DonatePage() {
  const { data: session } = useSession();
  const [selectedTier, setSelectedTier] = useState<number>(300);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [donorEmail, setDonorEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ paymentId: string; amount: number } | null>(null);
  const [supporters, setSupporters] = useState<DonationRecord[]>([]);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !donorName) setDonorName(session.user.name);
      if (session.user.email && !donorEmail) setDonorEmail(session.user.email);
    }
  }, [session]);

  // Fetch recent public supporters
  useEffect(() => {
    fetch("/api/donations")
      .then((res) => res.json())
      .then((data) => {
        if (data?.donations) setSupporters(data.donations);
      })
      .catch(() => {});
  }, [successInfo]);

  const effectiveAmount = customAmount ? Number(customAmount) : selectedTier;

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!effectiveAmount || effectiveAmount < 10) {
      setErrorMsg("Please enter a donation amount of at least ₹10.");
      return;
    }

    if (typeof window === "undefined" || !(window as any).Razorpay) {
      setErrorMsg("Payment gateway is initializing. Please wait 2 seconds and try again.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order on backend
      const res = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: effectiveAmount,
          donorName: donorName.trim() || session?.user?.name || "Anonymous Patron",
          donorEmail: donorEmail.trim() || session?.user?.email || "",
          message: message.trim(),
          isPublic,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        if (orderData.needsConfig) {
          setErrorMsg(
            "Razorpay credentials are not yet configured on this server. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your environment variables."
          );
        } else {
          setErrorMsg(orderData.error || "Failed to initialize payment order.");
        }
        setLoading(false);
        return;
      }

      // 2. Open Razorpay Checkout Modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Unitainment",
        description: `Support Unitainment (₹${effectiveAmount})`,
        image: "https://unitainment.renitsuki.in/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: donorName || session?.user?.name || "",
          email: donorEmail || session?.user?.email || "",
        },
        theme: {
          color: "#06b6d4", // cyan-500 brand color
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        handler: async (response: any) => {
          // 3. Verify Payment Signature on backend
          try {
            const verifyRes = await fetch("/api/donations/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                amount: effectiveAmount,
                donorName: donorName || session?.user?.name || "Anonymous Supporter",
                donorEmail: donorEmail || session?.user?.email || "",
                message,
                isPublic,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccessInfo({
                paymentId: response.razorpay_payment_id,
                amount: effectiveAmount,
              });
            } else {
              setErrorMsg(verifyData.error || "Payment verification failed.");
            }
          } catch (err: any) {
            setErrorMsg("Network error during payment verification.");
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on("payment.failed", (response: any) => {
        setErrorMsg(response.error?.description || "Payment was cancelled or failed.");
        setLoading(false);
      });
      razorpayInstance.open();
    } catch (err: any) {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {/* Razorpay Standard Checkout SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="max-w-4xl mx-auto space-y-10 py-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-rose-950/30 via-slate-900 to-[#080c14] p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Support the Project</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Fuel the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-rose-400">Unitainment</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Unitainment is an independent, 100% free entertainment platform uniting IMDb movies, MyAnimeList tracking, and Steam games without annoying ads or paywalls. Your generous contribution directly funds server uptime, database hosting, and high-frequency API synchronization.
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none bg-gradient-to-l from-rose-500 to-transparent" />
        </div>

        {/* Success Modal / State */}
        {successInfo && (
          <div className="p-8 rounded-3xl border border-emerald-500/30 bg-emerald-950/20 text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-white">Thank You for Your Support! 🎉</h2>
            <p className="text-slate-300 text-sm max-w-md mx-auto">
              Your donation of <span className="font-bold text-emerald-400">₹{successInfo.amount}</span> was received successfully. You are directly empowering continuous improvements on Unitainment!
            </p>
            <p className="text-xs text-slate-400 font-mono">Payment ID: {successInfo.paymentId}</p>
            <button
              onClick={() => setSuccessInfo(null)}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
            >
              Make Another Contribution
            </button>
          </div>
        )}

        {/* Donation Form Card */}
        <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-6 sm:p-10 shadow-2xl space-y-8">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>Choose Contribution Tier</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a tier or enter any custom amount in Indian Rupees (INR).
            </p>
          </div>

          {/* Tier Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PRESET_TIERS.map((tier) => {
              const isSelected = selectedTier === tier.amount && !customAmount;
              return (
                <button
                  key={tier.amount}
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier.amount);
                    setCustomAmount("");
                  }}
                  className={`relative p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10 scale-[1.02]"
                      : "bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20 hover:bg-white/[0.05]"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500 text-black shadow-sm">
                      Popular
                    </span>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{tier.icon}</span>
                    <span className="text-lg font-black text-cyan-400">₹{tier.amount}</span>
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{tier.label}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{tier.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Amount Field */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              Or enter custom amount (INR):
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
              <input
                type="number"
                min="10"
                step="10"
                placeholder="Custom amount (e.g. 250)"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm font-semibold"
              />
            </div>
          </div>

          {/* Backer Details & Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Your Name (Optional):</label>
              <input
                type="text"
                placeholder="e.g. John Doe / Anonymous"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address (Optional):</label>
              <input
                type="email"
                placeholder="For receipt & confirmation"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm"
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Message / Feature Wish (Optional):</label>
              <textarea
                rows={2}
                placeholder="Leave an encouraging note or something you'd like to see next!"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-sm resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="public-check"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-white/20 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="public-check" className="text-xs text-slate-300 cursor-pointer select-none">
                Show my name and message publicly on the Supporter Wall
              </label>
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDonate}
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-rose-500 hover:from-cyan-400 hover:via-blue-400 hover:to-rose-400 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting to Razorpay...</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white text-white" />
                  <span>Donate ₹{effectiveAmount} via Razorpay (UPI / Cards / NetBanking)</span>
                </>
              )}
            </button>
            <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit SSL Secured
              </span>
              <span>•</span>
              <span>Instant UPI (GPay, PhonePe, Paytm)</span>
              <span>•</span>
              <span>Zero Platform Fees</span>
            </div>
          </div>
        </div>

        {/* Recent Supporters Wall */}
        <div className="rounded-3xl border border-white/10 bg-[#0c1220] p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <h2 className="text-xl font-bold text-white">Community Supporter Wall</h2>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              {supporters.length} Backers
            </span>
          </div>

          {supporters.length === 0 ? (
            <div className="py-10 text-center text-slate-500 text-sm">
              <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              Be the very first supporter to be featured on the wall!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supporters.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {item.donorName || "Anonymous Hero"}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      ₹{item.amount}
                    </span>
                  </div>
                  {item.message && (
                    <p className="text-xs text-slate-300 italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                      &ldquo;{item.message}&rdquo;
                    </p>
                  )}
                  <span className="text-[10px] text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
