import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");

  try {
    const where: any = {};
    if (category && category !== "ALL") {
      where.category = category;
    }

    const threads = await prisma.forumThread.findMany({
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

    return NextResponse.json({ threads });
  } catch (error) {
    console.error("GET /api/forum error:", error);
    return NextResponse.json({ error: "Failed to fetch forum threads" }, { status: 500 });
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
    const { title, content, category, tags } = body;

    if (!title || !content || !category) {
      return NextResponse.json({ error: "Title, content, and category are required" }, { status: 400 });
    }

    const thread = await prisma.forumThread.create({
      data: {
        userId,
        title,
        content,
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

    return NextResponse.json({ thread });
  } catch (error) {
    console.error("POST /api/forum error:", error);
    return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
  }
}
