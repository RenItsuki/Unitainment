import { prisma } from "@/lib/prisma";
import type { Session } from "next-auth";

/**
 * Ensures an authenticated session has an active, valid record in the database.
 * If the user was authenticated (e.g. Google OAuth) but their record does not yet exist
 * in the active database instance, this creates the user and returns their database record.
 */
export async function getOrCreateSessionUser(session: Session | null) {
  if (!session?.user?.email) return null;

  const email = session.user.email.toLowerCase().trim();
  const sessionUserId = (session.user as any).id;

  try {
    // 1. Try finding by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // 2. Try finding by session id if present
    if (!user && sessionUserId) {
      user = await prisma.user.findUnique({
        where: { id: sessionUserId },
      });
    }

    // 3. If still not found, auto-create the user in the database
    if (!user) {
      const baseName = session.user.name || email.split("@")[0] || "User";
      let candidateUsername = baseName
        .toLowerCase()
        .replace(/[^a-zA-Z0-9_]/g, "")
        .slice(0, 15) || "user";

      // Ensure candidate username is unique
      const existing = await prisma.user.findFirst({
        where: { username: candidateUsername },
      });
      if (existing) {
        candidateUsername = `${candidateUsername}_${Math.floor(100 + Math.random() * 900)}`;
      }

      user = await prisma.user.create({
        data: {
          email,
          name: session.user.name || baseName,
          username: candidateUsername,
          image: session.user.image,
          hasCustomUsername: false,
          bio: "Explorer of Movies, Anime & Games on Unitainment.",
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error in getOrCreateSessionUser:", error);
    return null;
  }
}
