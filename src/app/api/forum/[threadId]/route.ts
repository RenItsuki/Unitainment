import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionUser } from "@/lib/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  try {
    const thread = await prisma.forumThread.findUnique({
      where: { id: params.threadId },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
        replies: {
          include: {
            user: {
              select: { id: true, name: true, image: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404, headers: noCacheHeaders });
    }

    // Increment view count
    try {
      await prisma.forumThread.update({
        where: { id: params.threadId },
        data: { views: { increment: 1 } },
      });
    } catch {
      // non-fatal
    }

    return NextResponse.json({ thread }, { headers: noCacheHeaders });
  } catch (error) {
    console.error("GET /api/forum/[threadId] error:", error);
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500, headers: noCacheHeaders });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in to reply." }, { status: 401 });
    }

    const user = await getOrCreateSessionUser(session);
    if (!user) {
      return NextResponse.json({ error: "Could not verify user account. Please sign in again." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Reply content cannot be empty." }, { status: 400 });
    }

    const reply = await prisma.forumReply.create({
      data: {
        threadId: params.threadId,
        userId: user.id,
        content: content.trim(),
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json(
      { reply },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/forum/[threadId] reply error:", error);
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
  }
}
