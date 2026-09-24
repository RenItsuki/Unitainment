import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Razorpay credentials not configured on server" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    let { amount, currency = "INR", receipt } = body;

    const parsedAmount = Number(amount);
    // Minimum amount: 100 paise (₹1.00)
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 paise (₹1.00)." },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(parsedAmount),
      currency: currency || "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id,
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    const statusCode = error?.statusCode || error?.status || 500;
    const message = error?.error?.description || error?.message || "Failed to create Razorpay order";
    return NextResponse.json(
      { error: message },
      { status: statusCode === 401 ? 401 : 500 }
    );
  }
}
