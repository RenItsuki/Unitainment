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
    const rawInput = searchParams.get("username")?.trim() || "";

    // Strip leading '@' if provided
    const cleanUsername = rawInput.replace(/^@/, "").trim().toLowerCase();

    if (!cleanUsername) {
      return NextResponse.json(
        { available: false, inDatabase: false, message: "Please enter a username." },
        { status: 400 }
      );
    }

    // Normalized alphanumeric string (ignoring spaces, dashes, dots, underscores)
    const stripped = cleanUsername.replace(/[\s\-_.]/g, "");

    if (RESERVED_USERNAMES.has(cleanUsername) || RESERVED_USERNAMES.has(stripped)) {
      return NextResponse.json({
        available: false,
        inDatabase: true,
        message: "Not available (this username is reserved).",
      });
    }

    // Format validation: 3-25 characters
    if (cleanUsername.length < 3 || cleanUsername.length > 25) {
      return NextResponse.json(
        {
          available: false,
          inDatabase: false,
          message: "Username must be between 3 and 25 characters.",
        },
        { status: 400 }
      );
    }

    // Check database to see if this user or username already exists
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
      },
    });

    const match = users.find((u) => {
      const dbUsername = u.username?.toLowerCase();
      const dbStrippedUser = dbUsername?.replace(/[\s\-_.]/g, "");
      const dbName = u.name?.toLowerCase();
      const dbStrippedName = dbName?.replace(/[\s\-_.]/g, "");
      const dbEmailPrefix = u.email?.split("@")[0].toLowerCase().replace(/[\s\-_.]/g, "");

      return (
        dbUsername === cleanUsername ||
        dbStrippedUser === stripped ||
        dbName === cleanUsername ||
        dbStrippedName === stripped ||
        dbEmailPrefix === stripped
      );
    });

    if (match) {
      // It IS already in the database -> NOT AVAILABLE for registration
      return NextResponse.json({
        available: false,
        inDatabase: true,
        message: `Not available (already in the database as @${match.username || cleanUsername}).`,
      });
    }

    // It is NOT in the database -> AVAILABLE for registration
    return NextResponse.json({
      available: true,
      inDatabase: false,
      message: `Available (not in database)!`,
    });
  } catch (error: any) {
    console.error("Error checking username in database:", error);
    return NextResponse.json(
      { available: false, inDatabase: false, message: "Error checking database." },
      { status: 500 }
    );
  }
}
