import { notFound } from "next/navigation";
import Link from "next/link";
import { 
  Star, 
  ExternalLink, 
  Calendar, 
  Layers, 
  Film, 
  Tv, 
  Gamepad2, 
  Play, 
  ArrowLeft,
  Clock,
  Users,
  Tag,
  Globe,
  Headphones,
  Sparkles,
  Building2,
  Trophy,
  Award,
  DollarSign,
  Clapperboard,
  Shield
} from "lucide-react";
import { getMovieOrShowById } from "@/lib/api/tmdb";
import { getAnimeById } from "@/lib/api/mal";
import { getGameById } from "@/lib/api/rawg";
import { StatusSelector } from "@/components/StatusSelector";
import { ReviewSection } from "@/components/ReviewSection";
import { UnifiedMediaItem } from "@/types";
import { getOptimizedImageUrl, getFallbackPlaceholder } from "@/lib/imageHelper";

interface PageProps {
  params: {
    type: string;
    id: string;
  };
}

export default async function MediaDetailPage({ params }: PageProps) {
  const mediaType = params.type.toUpperCase();
  let mediaItem: UnifiedMediaItem | null = null;

  if (mediaType === "MOVIE" || mediaType === "SERIES") {
    mediaItem = await getMovieOrShowById(mediaType as any, params.id);
  } else if (mediaType === "ANIME") {
    mediaItem = await getAnimeById(params.id);
  } else if (mediaType === "GAME") {
    mediaItem = await getGameById(params.id);
  }

  if (!mediaItem) {
    notFound();
  }

  const isMovie = mediaItem.type === "MOVIE";
  const isSeries = mediaItem.type === "SERIES";
  const isAnime = mediaItem.type === "ANIME";
  const isGame = mediaItem.type === "GAME";

  const sourceName = isGame 
    ? "Steam Store" 
    : mediaItem.sourceUrl?.includes("imdb.com")
    ? "IMDb"
    : isMovie || isSeries 
    ? "IMDb / TMDB" 
    : "MyAnimeList";


  const TypeIcon = isGame ? Gamepad2 : isAnime ? Tv : Film;

  // Extract YouTube ID for video player if available
  const youtubeMatch = mediaItem.trailerUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  const youtubeId = youtubeMatch ? youtubeMatch[1] : null;

  return (
    <div className="space-y-10 pb-16">
      {/* Navigation Breadcrumb / Back button */}
      <div className="flex items-center justify-between">
        <Link
          href={`/${params.type.toLowerCase() === "series" ? "movies" : params.type.toLowerCase() === "game" ? "games" : params.type.toLowerCase()}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to {isGame ? "Steam Games" : isAnime ? "Anime & Manga" : "Movies & TV"}</span>
        </Link>

        {mediaItem.sourceUrl && (
          <a
            href={mediaItem.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            <span>Verified on {sourceName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* Cinematic Hero Backdrop & Info Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#0c1220] shadow-2xl">
        {mediaItem.backdropUrl && (
          <div className="absolute inset-0 h-96 w-full overflow-hidden opacity-35 pointer-events-none">
            <img
              src={getOptimizedImageUrl(mediaItem.backdropUrl, mediaItem.type)}
              alt={mediaItem.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("/api/image-proxy") && mediaItem.backdropUrl && !mediaItem.backdropUrl.startsWith("/")) {
                  target.src = `/api/image-proxy?url=${encodeURIComponent(mediaItem.backdropUrl)}`;
                } else {
                  target.src = getFallbackPlaceholder(mediaItem.type);
                }
              }}
              className="w-full h-full object-cover object-center blur-xs scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1220] via-[#0c1220]/75 to-transparent" />
          </div>
        )}

        <div className="relative z-10 p-6 sm:p-10 flex flex-col md:flex-row gap-8 items-start">
          {/* High-res Poster */}
          <div className="w-52 sm:w-64 shrink-0 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-slate-900 mx-auto md:mx-0">
            <img
              src={getOptimizedImageUrl(mediaItem.posterUrl, mediaItem.type)}
              alt={mediaItem.title}
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (!target.src.includes("/api/image-proxy") && mediaItem.posterUrl && !mediaItem.posterUrl.startsWith("/")) {
                  target.src = `/api/image-proxy?url=${encodeURIComponent(mediaItem.posterUrl)}`;
                } else {
                  target.src = getFallbackPlaceholder(mediaItem.type);
                }
              }}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <TypeIcon className="w-3.5 h-3.5" />
                {isGame ? "Steam Game" : mediaItem.type}
              </span>

              {mediaItem.statusText && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-white/10">
                  {mediaItem.statusText}
                </span>
              )}

              {mediaItem.price && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {mediaItem.price}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {mediaItem.title}
            </h1>

            {mediaItem.originalTitle && mediaItem.originalTitle !== mediaItem.title && (
              <p className="text-sm text-slate-400 font-medium">
                Original Title: <span className="text-slate-300 italic">{mediaItem.originalTitle}</span>
              </p>
            )}

            {/* Score & Primary Bar */}
            <div className="flex flex-wrap items-center gap-4 py-2 text-sm text-slate-300">
              {mediaItem.score !== undefined && (
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-400 font-black text-lg">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>{mediaItem.score}</span>
                  <span className="text-xs font-normal text-amber-300/80">/ 10</span>
                </div>
              )}

              {mediaItem.votes && (
                <div className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{mediaItem.votes.toLocaleString()}</span> user votes
                </div>
              )}

              {mediaItem.releaseDate && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{mediaItem.releaseDate}</span>
                </div>
              )}
            </div>

            {/* Genres */}
            {mediaItem.genres && mediaItem.genres.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {mediaItem.genres.map((genre) => (
                  <span
                    key={genre}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-slate-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Dynamic Specifics Box (Seasons, Episodes, Runtime, Avg Playtime, Steam Live Players) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3">
              {/* Episodes (Anime / Series) */}
              {(isAnime || isSeries) && mediaItem.episodes && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    Episode Count
                  </span>
                  <p className="text-sm font-bold text-white">
                    {mediaItem.episodes} Episodes
                  </p>
                </div>
              )}

              {/* Seasons (Anime / Series) */}
              {(isAnime || isSeries) && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Tv className="w-3.5 h-3.5 text-purple-400" />
                    Seasons
                  </span>
                  <p className="text-sm font-bold text-white">
                    {mediaItem.seasons ? `${mediaItem.seasons} Season${mediaItem.seasons > 1 ? "s" : ""}` : "1 Season / Series"}
                  </p>
                </div>
              )}

              {/* Runtime (Movies / Anime / Series) */}
              {mediaItem.runtime && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {isMovie ? "Movie Runtime" : "Episode Runtime"}
                  </span>
                  <p className="text-sm font-bold text-white">
                    {mediaItem.runtime}
                  </p>
                </div>
              )}

              {/* Average Play Time (Games) */}
              {isGame && mediaItem.avgPlaytime && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    Average Play Time
                  </span>
                  <p className="text-sm font-bold text-emerald-300">
                    {mediaItem.avgPlaytime}
                  </p>
                </div>
              )}

              {/* Live Concurrent Players (Games) */}
              {isGame && mediaItem.livePlayers && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    Live Players Online
                  </span>
                  <p className="text-sm font-bold text-cyan-300">
                    {mediaItem.livePlayers.toLocaleString()} Active
                  </p>
                </div>
              )}

              {/* Game Price / Status */}
              {isGame && mediaItem.price && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Tag className="w-3.5 h-3.5 text-yellow-400" />
                    Steam Store Price
                  </span>
                  <p className="text-sm font-bold text-white">
                    {mediaItem.price}
                  </p>
                </div>
              )}

              {/* Audio Language / Dub & Sub */}
              {mediaItem.audioLanguage && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Headphones className="w-3.5 h-3.5 text-pink-400" />
                    Audio & Language
                  </span>
                  <p className="text-sm font-bold text-white">
                    {mediaItem.audioLanguage === "BOTH" ? "Dual Audio (Dub + Sub)" : mediaItem.audioLanguage === "SUB" ? "Original Audio (Sub)" : "English Dub"}
                  </p>
                </div>
              )}

              {/* Country of Origin */}
              {mediaItem.country && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    Origin Country
                  </span>
                  <p className="text-sm font-bold text-white">
                    {mediaItem.country}
                  </p>
                </div>
              )}

              {/* Studio / Developer */}
              {mediaItem.studioOrDeveloper && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {isGame ? "Developer / Publisher" : "Studio / Network"}
                  </span>
                  <p className="text-sm font-bold text-white truncate">
                    {mediaItem.studioOrDeveloper}
                  </p>
                </div>
              )}

              {/* Director (IMDb) */}
              {mediaItem.director && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Clapperboard className="w-3.5 h-3.5 text-purple-400" />
                    Director
                  </span>
                  <p className="text-sm font-bold text-white truncate">
                    {mediaItem.director}
                  </p>
                </div>
              )}

              {/* Content Rating (IMDb) */}
              {mediaItem.rated && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    Rated
                  </span>
                  <p className="text-sm font-bold text-amber-300">
                    {mediaItem.rated}
                  </p>
                </div>
              )}

              {/* Metascore (IMDb) */}
              {mediaItem.metascore && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-emerald-400" />
                    Metascore
                  </span>
                  <p className="text-sm font-bold text-emerald-300">
                    {mediaItem.metascore} / 100
                  </p>
                </div>
              )}

              {/* Box Office (IMDb) */}
              {mediaItem.boxOffice && (
                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10">
                  <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Box Office
                  </span>
                  <p className="text-sm font-bold text-white truncate">
                    {mediaItem.boxOffice}
                  </p>
                </div>
              )}
            </div>

            {/* Leading Cast (IMDb) */}
            {mediaItem.actors && (
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 mt-3">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Leading Cast:</span>
                <p className="text-xs text-slate-200 font-medium">{mediaItem.actors}</p>
              </div>
            )}

            {/* Awards (IMDb) */}
            {mediaItem.awards && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mt-3">
                <Trophy className="w-4 h-4 shrink-0 text-amber-400" />
                <span className="font-semibold">{mediaItem.awards}</span>
              </div>
            )}


            {/* Platforms for Games */}
            {isGame && mediaItem.platforms && mediaItem.platforms.length > 0 && (
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 block mb-1.5">Supported Platforms:</span>
                <div className="flex flex-wrap gap-1.5">
                  {mediaItem.platforms.map((plat) => (
                    <span
                      key={plat}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-300"
                    >
                      {plat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* User List Tracking & External Store Link Bar */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <StatusSelector mediaItem={mediaItem} />

              {mediaItem.sourceUrl && (
                <a
                  href={mediaItem.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 border border-white/10 transition-all shadow-md active:scale-95"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View on {sourceName}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Synopsis / Summary */}
      <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>Synopsis & Summary</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed whitespace-pre-wrap">
          {mediaItem.overview}
        </p>
      </section>

      {/* Official Trailer Video Embed if present */}
      {youtubeId && (
        <section className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Play className="w-5 h-5 text-cyan-400" />
            <span>Official Trailer & Gameplay</span>
          </h2>
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={`${mediaItem.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </section>
      )}

      {/* Community Ratings & Reviews Section (Rate 1-10 + Comments + Reviews) */}
      <ReviewSection mediaItem={mediaItem} />
    </div>
  );
}
