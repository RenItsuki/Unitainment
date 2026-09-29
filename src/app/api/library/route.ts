import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionUser } from "@/lib/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noCacheHeaders });
  }

  const user = await getOrCreateSessionUser(session);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401, headers: noCacheHeaders });
  }

  const userId = user.id;
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

    return NextResponse.json({ entries }, { headers: noCacheHeaders });
  } catch (error) {
    console.error("GET /api/library error:", error);
    return NextResponse.json({ entries: [] }, { headers: noCacheHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateSessionUser(session);
    if (!user) {
      return NextResponse.json({ error: "Could not verify user account" }, { status: 401 });
    }

    const userId = user.id;
    const body = await request.json().catch(() => ({}));
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

    return NextResponse.json(
      { entry },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/library error:", error);
    return NextResponse.json({ error: "Failed to update library" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateSessionUser(session);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = user.id;
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get("id");

    if (!entryId) {
      return NextResponse.json({ error: "Entry ID required" }, { status: 400 });
    }

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
