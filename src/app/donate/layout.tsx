import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Unitainment — Help Keep the Platform Free",
  description:
    "Unitainment is a free, community-driven entertainment tracker. If you enjoy using it, consider supporting the project to keep the servers running and new features coming.",
  alternates: {
    canonical: "/donate",
  },
  openGraph: {
    title: "Support Unitainment | Donate",
    description:
      "Help keep Unitainment free. Your support funds servers, APIs, and new features for the community.",
    url: "/donate",
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
