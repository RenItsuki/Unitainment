import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In & Register | Unitainment",
  description: "Sign in or create your Unitainment account to track movies, anime, and games, leave reviews, and chat with the community.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
