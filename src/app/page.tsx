import Link from "next/link";
import { 
  Film, 
  Tv, 
  Gamepad2, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Flame, 
  Radio, 
  Star, 
  MessageCircle, 
  Eye, 
  Search,
  Globe,
  Clock
} from "lucide-react";
import { fetchTrendingMovies, fetchTrendingShows } from "@/lib/api/tmdb";
import { fetchTopAnime } from "@/lib/api/mal";
import { fetchTrendingGames } from "@/lib/api/rawg";
import { prisma } from "@/lib/prisma";
import { MediaCard } from "@/components/MediaCard";
import { HomeSearchSection } from "@/components/HomeSearchSection";

export default async function HomePage() {
  const [movies, anime, games] = await Promise.all([
    fetchTrendingMovies(),
    fetchTopAnime(1),
    fetchTrendingGames(1),
  ]);

  let hotThreads: any[] = [];
  try {
    hotThreads = await prisma.forumThread.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { replies: true } },
      },
      orderBy: [{ views: "desc" }, { createdAt: "desc" }],
      take: 3,
    });
  } catch (err) {
    console.warn("Prisma forumThread query skipped:", err);
    hotThreads = [
      {
        id: "demo-thread-1",
        title: "Best Movies & Shows of the Year - Discussion & Rankings",
        content: "What are your top movies and series this season? Let's discuss!",
        category: "Movies",
        views: 1420,
        createdAt: new Date().toISOString(),
        user: { id: "u1", name: "Joy Karmakar", image: null },
        _count: { replies: 18 },
      },
      {
        id: "demo-thread-2",
        title: "Upcoming Anime Season Highlights & Watchlist",
        content: "Share your top anticipated anime series dropping next season.",
        category: "Anime",
        views: 980,
        createdAt: new Date().toISOString(),
        user: { id: "u2", name: "Ren Itsuki", image: null },
        _count: { replies: 24 },
      },
    ];
  }

  let recentChats: any[] = [];
  try {
    recentChats = await prisma.chatMessage.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 4,
    });
  } catch (err) {
    console.warn("Prisma chatMessage query skipped:", err);
    recentChats = [
      {
        id: "demo-chat-1",
        content: "Welcome to the Unitainment Live Lounge! Explore movies, anime, and games.",
        createdAt: new Date().toISOString(),
        user: { id: "u1", name: "Unitainment Bot", image: null },
      },
    ];
  }


  return (
    <div className="space-y-16 py-4">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-[#0d1322] to-[#080c14] p-6 sm:p-12 lg:p-14 shadow-2xl">
        {/* Visual Artwork Backdrop from the user's banner */}
        <div className="absolute inset-0 pointer-events-none opacity-20 sm:opacity-25 mix-blend-screen overflow-hidden">
          <img
            src="/hero-banner.jpg"
            alt="Unitainment Universe"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080c14] via-[#080c14]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c14] via-transparent to-[#080c14]/40" />
        </div>

        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold backdrop-blur-md">
            <img src="/logo.png" alt="Unitainment" className="w-4 h-4 rounded-md object-cover" />
            <span>ONE PLATFORM. ALL STORIES.</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            IMDb + MyAnimeList + Steam. <br />
            <span className="gradient-text">Unified In One Website.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            Rate, review, and track across <span className="text-cyan-400 font-semibold">Plan to watch/play</span>,{" "}
            <span className="text-amber-400 font-semibold">Watching/Playing</span>, and{" "}
            <span className="text-emerald-400 font-semibold">Completed</span>. Filter by genre, country, dub/sub audio, and sort by rating or release date.
          </p>

          {/* Quick Hub Navigation Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href="/movies"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition-all active:scale-95"
            >
              <Film className="w-4 h-4 text-blue-400" />
              <span>Movies & TV (IMDb)</span>
            </Link>

            <Link
              href="/anime"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 transition-all active:scale-95"
            >
              <Tv className="w-4 h-4 text-pink-400" />
              <span>Anime & Manga (MAL)</span>
            </Link>

            <Link
              href="/games"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-all active:scale-95"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Video Games (Steam)</span>
            </Link>

            <Link
              href="/forum"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Community Forums</span>
            </Link>

            <Link
              href="/chat"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 transition-all active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Chat Lounge</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Global Search & Filters Section on Homepage */}
      <HomeSearchSection
        initialMovies={movies.slice(0, 6)}
        initialAnime={anime.slice(0, 6)}
        initialGames={games.slice(0, 6)}
      />

      {/* 1. Hot Movies & TV Series */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 to-rose-500/20 text-amber-400 border border-amber-500/30">
              <Flame className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Hot Movies & Webseries</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                  Trending
                </span>
              </div>
              <p className="text-xs text-slate-400">Box office hits and top-streamed series with IMDb ratings</p>
            </div>
          </div>

          <Link
            href="/movies"
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Explore All Movies</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.slice(0, 6).map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 2. Hot Anime (MAL) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-pink-400 border border-pink-500/30">
              <Flame className="w-5 h-5 fill-pink-400 text-pink-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Hot Anime Releases (MAL)</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 animate-pulse">
                  Live MAL Scores
                </span>
              </div>
              <p className="text-xs text-slate-400">Highest rated and most discussed anime directly from MyAnimeList</p>
            </div>
          </div>

          <Link
            href="/anime"
            className="flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
          >
            <span>Explore All Anime</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {anime.slice(0, 6).map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 3. Hot Video Games */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
              <Flame className="w-5 h-5 fill-emerald-400 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Hot Video Games</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  Metacritic 90+
                </span>
              </div>
              <p className="text-xs text-slate-400">Must-play gaming masterpieces across PC and Consoles</p>
            </div>
          </div>

          <Link
            href="/games"
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Explore All Games</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {games.slice(0, 6).map((item) => (
            <MediaCard key={item.id} item={item} />
          ))}
        </div>
      </section>

      {/* 4. Hot Discussions (Forums / Forms) & Active Live Chats Side-by-Side */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Hot Forum Topics */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Hot Community Discussions</h3>
                <p className="text-xs text-slate-400">Trending topics from the entertainment boards</p>
              </div>
            </div>

            <Link
              href="/forum"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>View All Boards</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {hotThreads.map((thread) => (
              <Link
                key={thread.id}
                href={`/forum/${thread.id}`}
                className="block glass-card rounded-2xl p-4 border border-white/5 hover:border-purple-500/40 transition-all group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase">
                        {thread.category}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        by {thread.user?.name || "Member"}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-purple-300 transition-colors truncate">
                      {thread.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                    <span className="flex items-center gap-1 font-semibold text-cyan-400">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {thread._count.replies}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Eye className="w-3.5 h-3.5" />
                      {thread.views}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Hot Live Chat Ticker Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Live Chat Ticker</h3>
                <p className="text-xs text-slate-400">Active banter in #global-lounge</p>
              </div>
            </div>

            <Link
              href="/chat"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Join Live Chat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-3.5 shadow-xl">
            {recentChats.map((chat) => (
              <div key={chat.id} className="flex items-start gap-2.5 text-xs">
                <img
                  src={chat.user.image || `https://api.dicebear.com/7.x/bottts/svg?seed=${chat.user.name || "user"}`}
                  alt={chat.user.name || "User"}
                  className="w-7 h-7 rounded-full object-cover border border-white/10 shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-[11px] truncate">
                      {chat.user.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(chat.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] break-words line-clamp-2 mt-0.5">
                    {chat.message}
                  </p>
                </div>
              </div>
            ))}

            <Link
              href="/chat"
              className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 shadow-md active:scale-95 transition-all"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Jump Into Live Conversation</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
