import { useQuery } from "@tanstack/react-query";
import { getMyList, type Movie } from "@/lib/tmdb";
import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

const MyList = () => {
  const { data: myList, isLoading } = useQuery({
    queryKey: ["myList"],
    queryFn: getMyList,
  });

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      <div className="pt-24 px-4 md:px-8 pb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">My List</h1>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        ) : myList?.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-lg">Your list is empty</p>
            <p className="text-sm mt-2">Add movies and TV shows to your list to watch them later</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {myList?.map((movie: Movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title || movie.name || ""}
                poster_path={movie.poster_path}
                media_type={movie.media_type}
                overview={movie.overview}
                backdrop_path={movie.backdrop_path}
                release_date={movie.release_date}
                vote_average={movie.vote_average}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyList; 