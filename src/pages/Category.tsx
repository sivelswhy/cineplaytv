import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import MovieCard from "@/components/MovieCard";
import Navbar from "@/components/Navbar";
import { getTVShows, getMoviesByGenre, getKDramas, getPopular, type MovieResponse } from "@/lib/tmdb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const GENRE_IDS: Record<string, string> = {
  action: "28",
  comedy: "35",
  horror: "27",
  thriller: "53",
  romance: "10749",
  drama: "18",
  scifi: "878",
  animation: "16",
  adventure: "12",
  crime: "80",
  documentary: "99",
  family: "10751",
  fantasy: "14",
};

const CATEGORY_NAMES: Record<string, string> = {
  tv: "TV Shows",
  movie: "Movies",
  kdrama: "Korean Dramas",
  action: "Action Movies",
  comedy: "Comedy Movies",
  horror: "Horror Movies",
  thriller: "Thriller Movies",
  romance: "Romance Movies",
  drama: "Drama Movies",
  scifi: "Sci-Fi Movies",
  animation: "Animation Movies",
  adventure: "Adventure Movies",
  crime: "Crime Movies",
  documentary: "Documentary Movies",
  family: "Family Movies",
  fantasy: "Fantasy Movies",
};

const Category = () => {
  const { type } = useParams();
  const [sortBy, setSortBy] = useState("popularity.desc");
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["category", type, sortBy],
    queryFn: async ({ pageParam = 1 }) => {
      switch (type?.toLowerCase()) {
        case "tv":
          return getTVShows(sortBy, pageParam as number);
        case "kdrama":
          const kdramas = await getKDramas();
          return { results: kdramas, page: 1, total_pages: 1 } as MovieResponse;
        case "movie":
          return getPopular(sortBy, pageParam as number);
        default:
          const genreId = GENRE_IDS[type?.toLowerCase() || "action"];
          if (!genreId) {
            throw new Error("Invalid category");
          }
          return getMoviesByGenre(genreId, pageParam as number);
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: MovieResponse) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (error) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-24 px-[4%] text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
          <p>The category you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  if (isLoading) return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 px-[4%] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    </div>
  );

  const allContent = data?.pages.flatMap(page => page.results) || [];

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 px-[4%]">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {CATEGORY_NAMES[type?.toLowerCase() || ""] || "Category"}
            </h1>
            <p className="text-gray-400 mt-2">{allContent.length} titles</p>
          </div>
          {(type === "tv" || type === "movie") && (
            <Select onValueChange={setSortBy} defaultValue={sortBy}>
              <SelectTrigger className="w-[180px] bg-black text-white border-gray-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-black text-white border-gray-700">
                <SelectItem value="popularity.desc">Most Popular</SelectItem>
                <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                <SelectItem value={type === "tv" ? "first_air_date.desc" : "release_date.desc"}>Latest Release</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {allContent.map((item) => (
            <MovieCard
              key={`${item.id}-${item.title || item.name}`}
              id={item.id}
              title={item.title || item.name || ""}
              poster_path={item.poster_path}
              media_type={type === "tv" || type === "kdrama" ? "tv" : "movie"}
              overview={item.overview}
              backdrop_path={item.backdrop_path}
              release_date={item.release_date}
              vote_average={item.vote_average}
            />
          ))}
        </div>
        <div ref={ref} className="flex justify-center p-4">
          {isFetchingNextPage && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Category;