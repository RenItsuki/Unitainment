"use client";

import React, { useState } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";

interface RazorpayCheckoutButtonProps {
  amountInPaise: number; // e.g. 5000 for ₹50.00
  currency?: string;
  receipt?: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  onSuccess?: (data: { payment_id: string; order_id: string }) => void;
  onError?: (errorMessage: string) => void;
  onDismiss?: () => void;
}

export function RazorpayCheckoutButton({
  amountInPaise,
  currency = "INR",
  receipt,
  name = "Unitainment",
  description = "Standard Checkout",
  image = "/logo.png",
  prefill,
  notes,
  buttonText = "Pay with Razorpay",
  className,
  disabled = false,
  onSuccess,
  onError,
  onDismiss,
}: RazorpayCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const handleCheckout = async () => {
    if (amountInPaise < 100) {
      const err = "Amount must be at least 100 paise (₹1.00).";
      if (onError) onError(err);
      return;
    }

    if (typeof window === "undefined" || !(window as any).Razorpay) {
      const err = "Razorpay SDK is not ready yet. Please try again in a moment.";
      if (onError) onError(err);
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        const errorMsg = orderData.error || "Failed to create Razorpay order";
        if (onError) onError(errorMsg);
        setLoading(false);
        return;
      }

      // 2. Configure Standard Checkout modal
      const keyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id;

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name,
        description,
        image,
        order_id: orderData.order_id,
        prefill: {
          name: prefill?.name || "",
          email: prefill?.email || "",
          contact: prefill?.contact || "",
        },
        notes: notes || {},
        theme: {
          color: "#06b6d4",
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            if (onDismiss) onDismiss();
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Verify Payment Signature on backend
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              if (onSuccess) {
                onSuccess({
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                });
              }
            } else {
              const msg = verifyData.error || "Payment signature verification failed";
              if (onError) onError(msg);
            }
          } catch (err: any) {
            const msg = err.message || "Network error while verifying payment";
            if (onError) onError(msg);
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      razorpayInstance.on("payment.failed", (failedRes: any) => {
        const errorDesc =
          failedRes.error?.description || "Payment failed or was declined.";
        if (onError) onError(errorDesc);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      const msg = err.message || "An unexpected error occurred during checkout";
      if (onError) onError(msg);
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled || loading}
        className={className || "px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold transition-all disabled:opacity-50"}
      >
        {loading ? (
          <span className="flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </span>
        ) : (
          buttonText
        )}
      </button>
    </>
  );
}
