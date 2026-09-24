import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  try {
    const where: any = { userId };
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (type && type !== "ALL") {
      where.mediaItem = { type };
    }

    const entries = await prisma.userListEntry.findMany({
      where,
      include: {
        mediaItem: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("GET /api/library error:", error);
    return NextResponse.json({ error: "Failed to fetch library" }, { status: 500 });
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
      title,
      posterUrl,
      backdropUrl,
      releaseDate,
      overview,
      genres,
      score,
      status, // "PLAN_TO_WATCH", "WATCHING", "COMPLETED", "ON_HOLD", "DROPPED"
      progress = 0,
      rating = null,
      favorite = false,
    } = body;

    if (!externalId || !type || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Upsert MediaItem in our SQLite database
    const mediaItem = await prisma.mediaItem.upsert({
      where: {
        externalId_type: {
          externalId: String(externalId),
          type: String(type).toUpperCase(),
        },
      },
      update: {
        title: title || undefined,
        posterUrl: posterUrl || undefined,
        score: score ? parseFloat(score) : undefined,
      },
      create: {
        externalId: String(externalId),
        type: String(type).toUpperCase(),
        title: title || "Untitled",
        posterUrl,
        backdropUrl,
        releaseDate,
        overview,
        genres: Array.isArray(genres) ? genres.join(", ") : genres,
        score: score ? parseFloat(score) : undefined,
      },
    });

    // 2. Upsert UserListEntry
    const entry = await prisma.userListEntry.upsert({
      where: {
        userId_mediaItemId: {
          userId,
          mediaItemId: mediaItem.id,
        },
      },
      update: {
        status,
        progress: Number(progress) || 0,
        rating: rating !== null ? Number(rating) : undefined,
        favorite: Boolean(favorite),
      },
      create: {
        userId,
        mediaItemId: mediaItem.id,
        status,
        progress: Number(progress) || 0,
        rating: rating !== null ? Number(rating) : null,
        favorite: Boolean(favorite),
      },
      include: {
        mediaItem: true,
      },
    });

    return NextResponse.json({ entry });
  } catch (error) {
    console.error("POST /api/library error:", error);
    return NextResponse.json({ error: "Failed to update library" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const { searchParams } = new URL(request.url);
  const entryId = searchParams.get("id");

  if (!entryId) {
    return NextResponse.json({ error: "Entry ID required" }, { status: 400 });
  }

  try {
    await prisma.userListEntry.deleteMany({
      where: {
        id: entryId,
        userId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/library error:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 });
  }
}
