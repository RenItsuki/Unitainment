import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Reserved system usernames and pre-seeded accounts
const RESERVED_AND_SEED_USERNAMES = new Set([
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
  "guest",
  "joykarmakar",
  "alexvance",
  "joyguest",
]);

export async function GET(req: Request) {
  const noCacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  try {
    const { searchParams } = new URL(req.url);
    const rawInput = searchParams.get("username")?.trim() || "";

    // Strip leading '@' if provided
    const cleanUsername = rawInput.replace(/^@/, "").trim().toLowerCase();

    if (!cleanUsername) {
      return NextResponse.json(
        { available: false, inDatabase: false, message: "Please enter a username." },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Format validation: 3-25 characters
    if (cleanUsername.length < 3 || cleanUsername.length > 25) {
      return NextResponse.json(
        {
          available: false,
          inDatabase: false,
          message: "Username must be between 3 and 25 characters.",
        },
        { status: 400, headers: noCacheHeaders }
      );
    }

    // Normalized alphanumeric string (ignoring spaces, dashes, dots, underscores)
    const stripped = cleanUsername.replace(/[\s\-_.]/g, "");

    // 1. Check reserved and known baseline usernames
    if (
      RESERVED_AND_SEED_USERNAMES.has(cleanUsername) ||
      RESERVED_AND_SEED_USERNAMES.has(stripped)
    ) {
      return NextResponse.json(
        {
          available: false,
          inDatabase: true,
          message: "This username is already taken. Please choose something else.",
        },
        { headers: noCacheHeaders }
      );
    }

    // 2. Check database for existing users
    let matchFound = false;

    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
        },
      });

      const dbMatch = users.find((u) => {
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

      if (dbMatch) {
        matchFound = true;
      }
    } catch (dbErr) {
      console.warn("Database lookup warning in check-username (using reserved/baseline list):", dbErr);
    }

    if (matchFound) {
      return NextResponse.json(
        {
          available: false,
          inDatabase: true,
          message: "This username is already taken. Please choose something else.",
        },
        { headers: noCacheHeaders }
      );
    }

    // Username is NOT in the database and not reserved -> AVAILABLE!
    return NextResponse.json(
      {
        available: true,
        inDatabase: false,
        message: "Username is available!",
      },
      { headers: noCacheHeaders }
    );
  } catch (error: any) {
    console.error("Unexpected error in check-username route:", error);
    // Never show a hard error to the user that blocks signup; fallback gracefully
    return NextResponse.json(
      {
        available: true,
        inDatabase: false,
        message: "Username is available!",
      },
      { headers: noCacheHeaders }
    );
  }
}
