import Link from "next/link";
import { Compass, Home, Film, Tv, Gamepad2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="py-24 text-center space-y-6 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto shadow-2xl">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          404 Error
        </span>
        <h1 className="text-3xl font-black text-white">Entertainment Title Not Found</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          The movie, anime, game, or discussion thread you are looking for may have been moved or does not exist.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 transition-all shadow-md"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>

        <Link
          href="/movies"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
        >
          <Film className="w-3.5 h-3.5 text-blue-400" />
          <span>Movies</span>
        </Link>

        <Link
          href="/anime"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
        >
          <Tv className="w-3.5 h-3.5 text-pink-400" />
          <span>Anime</span>
        </Link>

        <Link
          href="/games"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Games</span>
        </Link>
      </div>
    </div>
  );
}
