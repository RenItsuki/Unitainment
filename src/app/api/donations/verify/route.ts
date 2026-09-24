import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      donorName,
      donorEmail,
      message,
      isPublic = true,
    } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json(
        { error: "Razorpay secret key not configured." },
        { status: 500 }
      );
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required payment verification parameters." },
        { status: 400 }
      );
    }

    // Verify HMAC SHA256 signature
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature verification failed." },
        { status: 400 }
      );
    }

    // Update or upsert donation record
    try {
      await prisma.donation.upsert({
        where: { razorpayOrderId: razorpay_order_id },
        update: {
          razorpayPaymentId: razorpay_payment_id,
          status: "SUCCESS",
          donorName: donorName || "Anonymous Supporter",
          donorEmail: donorEmail || null,
          message: message || null,
          isPublic: Boolean(isPublic),
        },
        create: {
          amount: Number(amount) || 100,
          currency: "INR",
          donorName: donorName || "Anonymous Supporter",
          donorEmail: donorEmail || null,
          message: message || null,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          status: "SUCCESS",
          isPublic: Boolean(isPublic),
        },
      });
    } catch (dbErr) {
      console.warn("Could not record successful donation to DB:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for supporting Unitainment! Your donation was successful.",
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error("Error verifying payment signature:", error);
    return NextResponse.json(
      { error: "Internal server error during verification." },
      { status: 500 }
    );
  }
}
