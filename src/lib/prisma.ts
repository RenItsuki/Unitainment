import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const tursoToken = process.env.TURSO_AUTH_TOKEN;

  // ── Cloud DB (Turso) — persistent, works on Vercel ──────────────────────
  if (tursoUrl) {
    const libsql = createClient({
      url: tursoUrl,
      authToken: tursoToken,
    });
    const adapter = new PrismaLibSQL(libsql);
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  // ── Local SQLite fallback (development without Turso) ───────────────────
  let dbUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";

  if (process.env.VERCEL && !tursoUrl) {
    // Vercel without Turso → copy to /tmp (read-only root workaround)
    try {
      const tmpDbPath = path.join("/tmp", "dev.db");
      const localDbPath = path.join(process.cwd(), "prisma", "dev.db");
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(localDbPath)) {
        fs.copyFileSync(localDbPath, tmpDbPath);
      }
      dbUrl = `file:${tmpDbPath}`;
    } catch (err) {
      console.warn("Could not copy SQLite to /tmp:", err);
    }
  }

  return new PrismaClient({
    datasources: { db: { url: dbUrl } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
