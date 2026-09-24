import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { LeftNavbar } from "@/components/LeftNavbar";

export const metadata: Metadata = {
  title: "Unitainment | Unified Entertainment Platform (IMDb + MAL + Games)",
  description: "All-in-one entertainment hub to discover, rate, track (Plan to watch/play, Watching, Completed), chat, and discuss movies, TV shows, anime, and video games.",
  icons: {
    icon: "/logo.png",
    shortcut: "/favicon.ico",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex bg-[#080c14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Providers>
          {/* Left Navbar Sidebar (Persistent across app for Movies, Anime, Games, Forums, Live Chat) */}
          <LeftNavbar />

          {/* Main Layout Area offset to the right on desktop */}
          <div className="flex-1 min-w-0 md:pl-64 lg:pl-72 flex flex-col min-h-screen">
            {/* Top Bar for Search & Quick Actions */}
            <Navbar />

            {/* Page Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-[#06090f] py-10 mt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                <div className="flex flex-col items-center md:items-start gap-1">
                  <span className="font-bold text-slate-300 text-sm tracking-wider">UNITAINMENT</span>
                  <p>One platform for all entertainment: IMDb, MyAnimeList & Games review ecosystem with Steam integration.</p>
                </div>

                <div className="flex items-center gap-6 font-medium">
                  <span className="text-slate-400">Powered by TMDB, Jikan (MAL), and Steam / RAWG</span>
                  <span>•</span>
                  <span>Full Tracking & Reviews</span>
                  <span>•</span>
                  <span>Google OAuth Enabled</span>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
