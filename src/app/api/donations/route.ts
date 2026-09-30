import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_SUPPORTERS = [
  {
    id: "donor_aman_150",
    amount: 150,
    currency: "INR",
    donorName: "Aman",
    message: "Loving the anime, movie & game tracking! Keep it up! 🍿",
    createdAt: new Date("2026-09-24T12:00:00Z").toISOString(),
  },
  {
    id: "donor_kishlay_50",
    amount: 50,
    currency: "INR",
    donorName: "Kishlay",
    message: "Great platform! Keep building! 🎮",
    createdAt: new Date("2026-09-30T04:00:00Z").toISOString(),
  },
];

export async function GET() {
  try {
    const dbDonations = await prisma.donation.findMany({
      where: {
        status: "SUCCESS",
        isPublic: true,
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        donorName: true,
        message: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 30,
    });

    // Always include baseline supporters; deduplicate by donorName+amount to avoid doubles
    const dbKeys = new Set(
      dbDonations.map((d) => `${d.donorName?.toLowerCase()}_${d.amount}`)
    );
    const missingBaseline = DEFAULT_SUPPORTERS.filter(
      (s) => !dbKeys.has(`${s.donorName.toLowerCase()}_${s.amount}`)
    );

    const merged = [...dbDonations, ...missingBaseline].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(
      { donations: merged },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.warn("Could not retrieve donations from DB, using baseline supporters:", error);
    return NextResponse.json(
      { donations: DEFAULT_SUPPORTERS },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
