import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    // 1. Google OAuth Provider
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),

    // 2. Standard Credentials Provider (Username / Email + Password)
    CredentialsProvider({
      id: "credentials",
      name: "Username & Password",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier?.trim().toLowerCase();
        const rawPassword = credentials?.password;

        if (!identifier || !rawPassword) {
          throw new Error("Please enter your username/email and password.");
        }

        // Look up by username or email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { username: identifier },
              { email: identifier },
            ],
          },
        });

        if (!user) {
          throw new Error("No account found with this username or email.");
        }

        if (!user.password) {
          throw new Error(
            "This account was registered using Google. Please sign in with Google or create a password."
          );
        }

        const isPasswordValid = await bcrypt.compare(rawPassword, user.password);

        if (!isPasswordValid) {
          throw new Error("Incorrect password. Please try again.");
        }

        return {
          id: user.id,
          name: user.name || user.username || "User",
          email: user.email,
          image: user.image,
          username: user.username,
        } as any;
      },
    }),

    // 3. Demo / Instant Guest Login Provider (For instant review testing)
    CredentialsProvider({
      id: "demo-login",
      name: "Guest / Demo Account",
      credentials: {
        username: { label: "Username", type: "text" },
      },
      async authorize(credentials) {
        const rawUsername = credentials?.username?.trim() || "Joy Guest";
        const cleanUsername = rawUsername.toLowerCase().replace(/[^a-zA-Z0-9_]/g, "").slice(0, 15) || "guest";
        const email = `${cleanUsername}@unitainment.demo`;

        let user = await prisma.user.findFirst({
          where: {
            OR: [{ email }, { username: cleanUsername }],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: rawUsername,
              username: cleanUsername,
              email: email,
              image: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanUsername)}`,
              bio: "Explorer of Movies, Anime & Games on Unitainment.",
            },
          });
        }

        return {
          id: user.id,
          name: user.name || user.username,
          email: user.email,
          image: user.image,
          username: user.username,
        } as any;
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            // Generate clean username from name or email
            const base = (user.name || user.email.split("@")[0])
              .toLowerCase()
              .replace(/[^a-zA-Z0-9_]/g, "")
              .slice(0, 12);
            let candidateUsername = base || "user";

            const nameClash = await prisma.user.findFirst({
              where: { username: candidateUsername },
            });
            if (nameClash) {
              candidateUsername = `${candidateUsername}_${Math.floor(100 + Math.random() * 900)}`;
            }

            await prisma.user.create({
              data: {
                name: user.name || "Google User",
                username: candidateUsername,
                email: user.email,
                image: user.image,
              },
            });
          } else if (user.image && existingUser.image !== user.image) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                image: user.image,
                name: user.name || existingUser.name,
              },
            });
          }
        } catch (err) {
          console.error("Warning during Google sign in DB sync:", err);
          // Allow sign in even if database sync encounters transient issues
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        if ((user as any).username) {
          token.username = (user as any).username;
        }
      }

      // Refresh username and id from database if missing
      if (token.email && (!token.id || !token.username)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: token.email },
            select: { id: true, username: true, name: true, bio: true, image: true },
          });
          if (dbUser) {
            token.id = dbUser.id;
            token.username = dbUser.username;
            if (dbUser.name) token.name = dbUser.name;
            if (dbUser.image) token.picture = dbUser.image;
          }
        } catch (e) {
          // ignore DB read error in jwt
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).username = token.username || null;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "unitainment-secret-development-key-32charsmin",
};
