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

    // Check if Aman is in the DB results
    const hasAman = dbDonations.some(
      (d) => d.donorName?.toLowerCase() === "aman" && d.amount === 150
    );

    const merged = hasAman ? dbDonations : [...dbDonations, ...DEFAULT_SUPPORTERS];

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
