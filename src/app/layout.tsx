import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";
import { LeftNavbar } from "@/components/LeftNavbar";
import { UsernameOnboardingModal } from "@/components/UsernameOnboardingModal";

export const viewport: Viewport = {
  themeColor: "#080c14",
  width: "device-width",
  initialScale: 1,
};

const baseUrl = process.env.NEXTAUTH_URL || "https://unitainment.renitsuki.in";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Unitainment | Unified Entertainment Platform (Movies, TV, Anime & Games)",
    template: "%s | Unitainment",
  },
  description:
    "The all-in-one entertainment tracker & community. Discover, rate, and track movies, TV shows, anime, and Steam games with IMDb, MyAnimeList, and RAWG integrations.",
  keywords: [
    "entertainment tracker",
    "movie watchlist",
    "anime tracker",
    "myanimelist alternative",
    "imdb movie database",
    "steam game tracker",
    "video game reviews",
    "tv series tracker",
    "unified entertainment",
    "anime community",
    "entertainment forum",
    "renitsuki unitainment",
  ],
  authors: [{ name: "Ren Itsuki", url: "https://renitsuki.in" }],
  creator: "Ren Itsuki",
  publisher: "Unitainment",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Unitainment",
    title: "Unitainment | Unified Entertainment Platform (Movies, TV, Anime & Games)",
    description:
      "All-in-one entertainment hub to discover, rate, track, and discuss movies, TV shows, anime, and video games.",
    images: [
      {
        url: "/hero-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Unitainment - Unified Entertainment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unitainment | Unified Entertainment Platform",
    description:
      "Discover, rate, and track movies, TV shows, anime, and video games with IMDb, MAL, and Steam sync.",
    images: ["/hero-banner.jpg"],
    creator: "@renitsuki",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Unitainment",
        "description": "Unified Entertainment Platform for Movies, TV Shows, Anime, and Video Games",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/?search={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Unitainment",
        "url": baseUrl,
        "logo": `${baseUrl}/logo.png`,
        "sameAs": [
          "https://github.com/RenItsuki/Unitainment"
        ]
      }
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex bg-[#080c14] text-slate-100 antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <Providers>
          {/* Left Navbar Sidebar (Persistent across app for Movies, Anime, Games, Forums, Live Chat) */}
          <LeftNavbar />

          {/* Onboarding modal to pick custom username for new sign-ins */}
          <UsernameOnboardingModal />

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
                  <a href="/donate" className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 font-bold">
                    <span>Support Unitainment</span>
                  </a>
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
