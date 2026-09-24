import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, donorName, donorEmail, message, isPublic = true } = body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 10) {
      return NextResponse.json(
        { error: "Minimum donation amount is ₹10." },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error: "Razorpay credentials not yet configured on server.",
          needsConfig: true,
        },
        { status: 503 }
      );
    }

    // Call Razorpay REST API to create an order
    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const amountInPaise = Math.round(parsedAmount * 100);

    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `donate_${Date.now()}`,
        notes: {
          donorName: donorName || "Anonymous Patron",
          message: message || "Community Supporter",
        },
      }),
    });

    if (!orderRes.ok) {
      const errorData = await orderRes.json().catch(() => ({}));
      console.error("Razorpay order creation failed:", errorData);
      return NextResponse.json(
        { error: errorData?.error?.description || "Failed to create Razorpay order." },
        { status: 500 }
      );
    }

    const order = await orderRes.json();

    // Record pending donation in database
    try {
      await prisma.donation.create({
        data: {
          amount: parsedAmount,
          currency: "INR",
          donorName: donorName || "Anonymous Supporter",
          donorEmail: donorEmail || null,
          message: message || null,
          razorpayOrderId: order.id,
          status: "PENDING",
          isPublic: Boolean(isPublic),
        },
      });
    } catch (dbErr) {
      console.warn("Could not save pending donation to DB:", dbErr);
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
    });
  } catch (error: any) {
    console.error("Error creating donation order:", error);
    return NextResponse.json(
      { error: "Internal server error occurred." },
      { status: 500 }
    );
  }
}
