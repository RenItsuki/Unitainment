import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Forum — Movies, Anime & Games Discussions",
  description:
    "Join Unitainment's community forum to discuss movies, anime, TV shows, and video games. Share reviews, recommendations, and opinions with fellow entertainment fans.",
  alternates: {
    canonical: "/forum",
  },
  openGraph: {
    title: "Community Forum | Unitainment",
    description:
      "Discuss movies, anime, TV shows, and games with the Unitainment community.",
    url: "/forum",
  },
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
