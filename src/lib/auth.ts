import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    CredentialsProvider({
      id: "demo-login",
      name: "Guest / Demo Account",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "JoyKarmakar" },
      },
      async authorize(credentials) {
        const username = credentials?.username?.trim() || "Joy Guest";
        const email = `${username.toLowerCase().replace(/\s+/g, ".")}@unitainment.demo`;

        // Find or create the user in our SQLite DB
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: username,
              email: email,
              image: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username)}`,
              bio: "Explorer of Movies, Anime & Games on Unitainment.",
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              name: user.name || "Google User",
              email: user.email,
              image: user.image,
            },
          });
        } else if (user.image && existingUser.image !== user.image) {
          await prisma.user.update({
            where: { id: existingUser.id },
            data: { image: user.image, name: user.name || existingUser.name },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Ensure token has user's database ID
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });
        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-unitainment-key-42",
};
