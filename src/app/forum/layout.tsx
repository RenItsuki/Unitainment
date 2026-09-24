import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Discussions & Forums",
  description: "Join discussions on the latest movies, anime episodes, gaming releases, and entertainment theories with the Unitainment community.",
  alternates: {
    canonical: "/forum",
  },
  openGraph: {
    title: "Community Discussions & Forums | Unitainment",
    description: "Join discussions on the latest movies, anime episodes, and games with the Unitainment community.",
    url: "/forum",
  },
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
