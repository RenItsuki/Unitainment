import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { username, email, password, name } = body;

    const cleanUsername = username?.trim().toLowerCase();
    const cleanEmail = email?.trim().toLowerCase();

    // 1. Validate Username
    if (!cleanUsername) {
      return NextResponse.json(
        { error: "Username is required." },
        { status: 400 }
      );
    }

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
        { error: "This username is reserved. Please pick another." },
        { status: 400 }
      );
    }

    // 2. Validate Email
    if (!cleanEmail) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 3. Validate Password
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 4. Check if username is already in database
    const existingUsername = await prisma.user.findFirst({
      where: { username: cleanUsername },
    });
    if (existingUsername) {
      return NextResponse.json(
        { error: `The username "@${cleanUsername}" is already taken.` },
        { status: 400 }
      );
    }

    // 5. Check if email is already in database
    const existingEmail = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 400 }
      );
    }

    // 6. Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Create new user
    const newUser = await prisma.user.create({
      data: {
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        name: name?.trim() || cleanUsername,
        image: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUsername)}`,
        bio: "Explorer of Movies, Anime & Games on Unitainment.",
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        image: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully! You can now sign in.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("User registration error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while creating your account." },
      { status: 500 }
    );
  }
}
