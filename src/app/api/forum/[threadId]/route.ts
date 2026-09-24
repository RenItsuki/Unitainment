import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
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
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    // Increment view count
    await prisma.forumThread.update({
      where: { id: params.threadId },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("GET /api/forum/[threadId] error:", error);
    return NextResponse.json({ error: "Failed to fetch thread" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: "Reply content cannot be empty" }, { status: 400 });
    }

    const reply = await prisma.forumReply.create({
      data: {
        threadId: params.threadId,
        userId,
        content: content.trim(),
      },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("POST /api/forum/[threadId] reply error:", error);
    return NextResponse.json({ error: "Failed to post reply" }, { status: 500 });
  }
}
