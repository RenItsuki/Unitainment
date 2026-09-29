import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionUser } from "@/lib/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_MESSAGES: Record<string, any[]> = {
  global: [
    {
      id: "chat_init_1",
      channel: "global",
      message: "Welcome to the Unitainment Live Lounge! What movies, anime or games are you enjoying this week? 🍿",
      createdAt: new Date("2026-09-24T12:00:00Z").toISOString(),
      user: {
        id: "u_admin",
        name: "Ren Itsuki",
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=RenItsuki",
      },
    },
    {
      id: "chat_init_2",
      channel: "global",
      message: "Just updated my watchlist with the latest Fall anime and Steam releases!",
      createdAt: new Date("2026-09-25T15:20:00Z").toISOString(),
      user: {
        id: "u_joy",
        name: "Joy Karmakar",
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=JoyKarmakar",
      },
    },
  ],
  movies: [
    {
      id: "chat_movies_1",
      channel: "movies",
      message: "Dune: Part Two was unbelievable in IMAX. Anyone catching upcoming cinema releases?",
      createdAt: new Date("2026-09-24T14:10:00Z").toISOString(),
      user: {
        id: "u_joy",
        name: "Joy Karmakar",
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=JoyKarmakar",
      },
    },
  ],
  anime: [
    {
      id: "chat_anime_1",
      channel: "anime",
      message: "The animation quality this season has been next level. Bleach TYBW & Re:Zero S3 looking stunning!",
      createdAt: new Date("2026-09-25T18:00:00Z").toISOString(),
      user: {
        id: "u_alex",
        name: "Alex Vance",
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=AlexVance",
      },
    },
  ],
  games: [
    {
      id: "chat_games_1",
      channel: "games",
      message: "Steam autumn gaming deals are active! What's everyone playing currently?",
      createdAt: new Date("2026-09-26T19:30:00Z").toISOString(),
      user: {
        id: "u_alex",
        name: "Alex Vance",
        image: "https://api.dicebear.com/7.x/bottts/svg?seed=AlexVance",
      },
    },
  ],
};

export async function GET(request: NextRequest) {
  const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel") || "global";

  try {
    const dbMessages = await prisma.chatMessage.findMany({
      where: { channel },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    if (dbMessages.length > 0) {
      return NextResponse.json({ messages: dbMessages.reverse() }, { headers: noCacheHeaders });
    }

    const fallbacks = DEFAULT_MESSAGES[channel] || DEFAULT_MESSAGES.global;
    return NextResponse.json({ messages: fallbacks }, { headers: noCacheHeaders });
  } catch (error) {
    console.warn("GET /api/chat error, returning default messages:", error);
    const fallbacks = DEFAULT_MESSAGES[channel] || DEFAULT_MESSAGES.global;
    return NextResponse.json({ messages: fallbacks }, { headers: noCacheHeaders });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to join the conversation." },
        { status: 401 }
      );
    }

    const user = await getOrCreateSessionUser(session);
    if (!user) {
      return NextResponse.json(
        { error: "Could not verify user account. Please sign in again." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { channel = "global", message } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
    }

    const newMsg = await prisma.chatMessage.create({
      data: {
        userId: user.id,
        channel,
        message: message.trim(),
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(
      { message: newMsg },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json(
      { error: "Failed to send chat message. Please try again." },
      { status: 500 }
    );
  }
}
