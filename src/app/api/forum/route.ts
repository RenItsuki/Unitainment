import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionUser } from "@/lib/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_THREADS = [
  {
    id: "thread_welcome_1",
    title: "Welcome to the Unitainment Forum & Community Hub!",
    content: "Connect with movie buffs, anime enthusiasts, and gamers. Share your watchlists, review recommendations, and discuss the latest releases.",
    category: "GENERAL",
    tags: "Welcome, Community, Unitainment",
    views: 342,
    createdAt: new Date("2026-09-24T10:00:00Z").toISOString(),
    user: {
      id: "u_admin",
      name: "Ren Itsuki",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=RenItsuki",
    },
    _count: { replies: 12 },
  },
  {
    id: "thread_anime_season",
    title: "Upcoming Anime Season Highlights & Watchlist Discussion",
    content: "Which new anime adaptations and sequels are you looking forward to this season? Drop your anticipated list below!",
    category: "ANIME",
    tags: "Anime, Fall Season, Recommendations",
    views: 215,
    createdAt: new Date("2026-09-25T14:30:00Z").toISOString(),
    user: {
      id: "u_alex",
      name: "Alex Vance",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=AlexVance",
    },
    _count: { replies: 8 },
  },
  {
    id: "thread_movies_2026",
    title: "Best Movies & Series of the Year - Ratings & Ranked Lists",
    content: "Let's debate the best cinematography and storyline across recent cinema releases. What are your 10/10 picks so far?",
    category: "MOVIES",
    tags: "Movies, IMDb, Top10",
    views: 189,
    createdAt: new Date("2026-09-26T12:00:00Z").toISOString(),
    user: {
      id: "u_joy",
      name: "Joy Karmakar",
      image: "https://api.dicebear.com/7.x/bottts/svg?seed=JoyKarmakar",
    },
    _count: { replies: 15 },
  },
];

export async function GET(request: NextRequest) {
  const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }

    const dbThreads = await prisma.forumThread.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { replies: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbThreads.length > 0) {
      return NextResponse.json({ threads: dbThreads }, { headers: noCacheHeaders });
    }

    // Filter fallback threads by category if needed
    const filteredFallbacks =
      category && category !== "ALL"
        ? DEFAULT_THREADS.filter((t) => t.category === category)
        : DEFAULT_THREADS;

    return NextResponse.json({ threads: filteredFallbacks }, { headers: noCacheHeaders });
  } catch (error) {
    console.warn("GET /api/forum error, returning baseline threads:", error);
    const filteredFallbacks =
      category && category !== "ALL"
        ? DEFAULT_THREADS.filter((t) => t.category === category)
        : DEFAULT_THREADS;
    return NextResponse.json({ threads: filteredFallbacks }, { headers: noCacheHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to create a discussion." },
        { status: 401 }
      );
    }

    const user = await getOrCreateSessionUser(session);
    if (!user) {
      return NextResponse.json(
        { error: "Unable to verify user account. Please refresh and try again." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { title, content, category, tags } = body;

    if (!title?.trim() || !content?.trim() || !category) {
      return NextResponse.json(
        { error: "Title, content, and category are required." },
        { status: 400 }
      );
    }

    const thread = await prisma.forumThread.create({
      data: {
        userId: user.id,
        title: title.trim(),
        content: content.trim(),
        category,
        tags: Array.isArray(tags) ? tags.join(", ") : tags || "",
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        _count: {
          select: { replies: true },
        },
      },
    });

    return NextResponse.json(
      { thread },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/forum error:", error);
    return NextResponse.json(
      { error: "Failed to create thread. Please try again." },
      { status: 500 }
    );
  }
}
