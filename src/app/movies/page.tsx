import { Film } from "lucide-react";
import { fetchTrendingMovies, fetchTrendingShows } from "@/lib/api/tmdb";
import { CategoryExplorer } from "@/components/CategoryExplorer";

export default async function MoviesPage() {
  const [movies, shows] = await Promise.all([
    fetchTrendingMovies(),
    fetchTrendingShows(),
  ]);

  const combined = [...movies, ...shows];
  const seen = new Set<string>();
  const initialItems = combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  const movieGenres = [
    "Action",
    "Adventure",
    "Drama",
    "Sci-Fi",
    "Thriller",
    "Crime",
    "Comedy",
    "Fantasy",
    "Animation",
    "History",
    "Mystery",
    "Horror",
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-blue-950/40 via-slate-900 to-[#080c14] p-8 sm:p-10 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Film className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
            IMDb / TMDB Powered
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Cinema & Television Hub</h1>
        <p className="text-sm text-slate-300 mt-2 max-w-2xl">
          Search and filter across blockbusters, critically acclaimed series, and international cinema. Sort by IMDb rating, release date, country, or audio preferences.
        </p>
      </div>

      {/* Explorer with Search, Filters, 10 Results per Page & Skeletons */}
      <CategoryExplorer
        initialItems={initialItems}
        mediaType="movies"
        availableGenres={movieGenres}
        showAudioFilter={true}
        showCountryFilter={true}
        title="Movies & Shows"
      />
    </div>
  );
}
