import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function getDatabaseUrl(): string {
  // In Vercel serverless environment, the root directory (/var/task) is read-only, but /tmp is writable.
  // Copy the SQLite database to /tmp/dev.db if it doesn't already exist.
  if (process.env.VERCEL) {
    try {
      const tmpDbPath = path.join("/tmp", "dev.db");
      const localDbPath = path.join(process.cwd(), "prisma", "dev.db");

      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(localDbPath)) {
          fs.copyFileSync(localDbPath, tmpDbPath);
        }
      }
      return `file:${tmpDbPath}`;
    } catch (err) {
      console.warn("Could not copy SQLite database to /tmp on Vercel:", err);
    }
  }

  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  return "file:./dev.db";
}

const dbUrl = getDatabaseUrl();
process.env.DATABASE_URL = dbUrl;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
