import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { searchContent } from "@/lib/tmdb";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchContent(query),
    enabled: query.length > 2,
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
  });

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 px-[4%]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {searchResults?.length === 0
              ? `No results found for "${query}"`
              : `Search results for "${query}"`}
          </h1>
          <p className="text-gray-400 mt-2">
            {searchResults?.length || 0} titles found
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-gray-400">Searching across all movies and TV shows...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {searchResults?.map((result) => (
              <MovieCard
                key={`${result.id}-${result.title || result.name}`}
                id={result.id}
                title={result.title || result.name || ""}
                poster_path={result.poster_path}
                media_type={result.media_type || "movie"}
                overview={result.overview}
                backdrop_path={result.backdrop_path}
              />
            ))}
          </div>
        )}

        {searchResults?.length === 0 && !isLoading && query.length > 2 && (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <h2 className="text-2xl font-semibold text-white mb-2">No results found</h2>
            <p className="text-gray-400">
              We couldn't find any matches for "{query}". Try different keywords or check the spelling.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search; 