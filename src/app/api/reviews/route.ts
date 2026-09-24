import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const externalId = searchParams.get("externalId");
  const type = searchParams.get("type");

  if (!externalId || !type) {
    return NextResponse.json({ error: "externalId and type required" }, { status: 400 });
  }

  try {
    const mediaItem = await prisma.mediaItem.findUnique({
      where: {
        externalId_type: {
          externalId,
          type: type.toUpperCase(),
        },
      },
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true, image: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({ reviews: mediaItem?.reviews || [] });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await request.json();
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
        userId,
        mediaItemId: mediaItem.id,
        rating: Math.min(10, Math.max(1, Number(rating))),
        title: reviewTitle || "Review",
        content,
      },
      include: {
        user: {
          select: { name: true, image: true },
        },
      },
    });

    return NextResponse.json({ review: newReview });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
