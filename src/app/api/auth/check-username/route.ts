import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUsername = searchParams.get("username")?.trim().toLowerCase();

    if (!rawUsername) {
      return NextResponse.json(
        { available: false, message: "Username is required." },
        { status: 400 }
      );
    }

    // Format validation: 3-20 characters, alphanumeric and underscore only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(rawUsername)) {
      return NextResponse.json(
        {
          available: false,
          message:
            "Username must be 3-20 characters long and contain only letters, numbers, or underscores.",
        },
        { status: 400 }
      );
    }

    if (RESERVED_USERNAMES.has(rawUsername)) {
      return NextResponse.json(
        { available: false, message: "This username is reserved." },
        { status: 400 }
      );
    }

    // Check database for existing username
    const existing = await prisma.user.findFirst({
      where: {
        username: {
          equals: rawUsername,
        },
      },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json({
        available: false,
        message: `Username "@${rawUsername}" is already taken.`,
      });
    }

    return NextResponse.json({
      available: true,
      message: `Username "@${rawUsername}" is available!`,
    });
  } catch (error: any) {
    console.error("Error checking username availability:", error);
    return NextResponse.json(
      { available: false, message: "Error checking username availability." },
      { status: 500 }
    );
  }
}
