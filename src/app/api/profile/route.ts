import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionUser } from "@/lib/user";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const RESERVED_USERNAMES = new Set([
  "admin",
  "administrator",
  "unitainment",
  "mod",
  "moderator",
  "system",
  "support",
  "help",
  "root",
  "api",
  "official",
]);

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getOrCreateSessionUser(session);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image,
        hasCustomUsername: user.hasCustomUsername,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await getOrCreateSessionUser(session);
    if (!currentUser) {
      return NextResponse.json(
        { error: "Could not load or initialize user account. Please try again." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { name, username, bio, image } = body;

    const updateData: {
      name?: string;
      username?: string;
      bio?: string;
      image?: string;
      hasCustomUsername?: boolean;
    } = {};

    if (typeof name === "string") {
      updateData.name = name.trim();
    }

    if (typeof bio === "string") {
      updateData.bio = bio.trim().slice(0, 300);
    }

    if (typeof image === "string" && image.trim().length > 0) {
      updateData.image = image.trim();
    }

    if (typeof username === "string" && username.trim().length > 0) {
      const cleanUsername = username.trim().toLowerCase();

      // Validate username regex
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(cleanUsername)) {
        return NextResponse.json(
          {
            error:
              "Username must be 3-20 characters long and contain only letters, numbers, or underscores.",
          },
          { status: 400 }
        );
      }

      if (RESERVED_USERNAMES.has(cleanUsername)) {
        return NextResponse.json(
          { error: "This username is already taken. Please choose something else." },
          { status: 400 }
        );
      }

      // Check if another user owns this username
      if (cleanUsername !== currentUser.username?.toLowerCase()) {
        const existing = await prisma.user.findFirst({
          where: {
            username: cleanUsername,
            NOT: { id: currentUser.id },
          },
        });

        if (existing) {
          return NextResponse.json(
            { error: "This username is already taken. Please choose something else." },
            { status: 400 }
          );
        }
      }

      updateData.username = cleanUsername;
      updateData.hasCustomUsername = true;
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        image: true,
        hasCustomUsername: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile. Please try again." },
      { status: 500 }
    );
  }
}
