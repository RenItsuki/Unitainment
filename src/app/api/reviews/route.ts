import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionUser } from "@/lib/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const externalId = searchParams.get("externalId");
  const type = searchParams.get("type");

  if (!externalId || !type) {
    return NextResponse.json({ error: "externalId and type required" }, { status: 400 });
  }

  try {
    const reviews = await prisma.review.findMany({
      where: {
        mediaItem: {
          externalId: String(externalId),
          type: String(type).toUpperCase(),
        },
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { reviews },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ reviews: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to write a review." }, { status: 401 });
    }

    const user = await getOrCreateSessionUser(session);
    if (!user) {
      return NextResponse.json({ error: "Could not verify user account." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      externalId,
      type,
      title: mediaTitle,
      posterUrl,
      rating,
      reviewTitle,
      content,
    } = body;

    if (!externalId || !type || !rating || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure MediaItem exists
    const mediaItem = await prisma.mediaItem.upsert({
      where: {
        externalId_type: {
          externalId: String(externalId),
          type: String(type).toUpperCase(),
        },
      },
      update: {},
      create: {
        externalId: String(externalId),
        type: String(type).toUpperCase(),
        title: mediaTitle || "Untitled",
        posterUrl,
      },
    });

    const newReview = await prisma.review.create({
      data: {
        userId: user.id,
        mediaItemId: mediaItem.id,
        rating: Math.min(10, Math.max(1, Number(rating))),
        title: reviewTitle || "Review",
        content,
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(
      { review: newReview },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
