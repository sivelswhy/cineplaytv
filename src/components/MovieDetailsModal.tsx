import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, Plus, ThumbsUp, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl, addToList, removeFromList, getSimilarMovies, getRecommendations, isInMyList } from "@/lib/tmdb";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface MovieDetailsModalProps {
  movie: any;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetailsModal = ({ movie, isOpen, onClose }: MovieDetailsModalProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isInList, setIsInList] = useState(false);
  
  useEffect(() => {
    if (movie) {
      setIsInList(isInMyList(movie.id));
    }
  }, [movie]);

  if (!movie) return null;

  const { data: similarMovies } = useQuery({
    queryKey: ["similar", movie.id],
    queryFn: () => getSimilarMovies(movie.id.toString()),
    enabled: isOpen
  });

  const { data: recommendations } = useQuery({
    queryKey: ["recommendations", movie.id],
    queryFn: () => getRecommendations(movie.id.toString()),
    enabled: isOpen
  });

  const handleAddToList = async () => {
    try {
      await addToList("myList", movie.id, movie.media_type || "movie");
      setIsInList(true);
      queryClient.invalidateQueries({ queryKey: ["myList"] });
      toast.success("Added to My List");
    } catch (error) {
      toast.error("Failed to add to list. Please try again.");
    }
  };

  const handleRemoveFromList = async () => {
    try {
      await removeFromList("myList", movie.id, movie.media_type || "movie");
      setIsInList(false);
      queryClient.invalidateQueries({ queryKey: ["myList"] });
      toast.success("Removed from My List");
    } catch (error) {
      toast.error("Failed to remove from list. Please try again.");
    }
  };

  const handleLike = () => {
    toast.success("Added to your liked titles");
  };

  const handleCategoryClick = (category: string) => {
    onClose();
    navigate(`/category/${category.toLowerCase()}`);
  };

  const handleMovieClick = (selectedMovie: any) => {
    onClose();
    navigate(`/${selectedMovie.media_type || "movie"}/${selectedMovie.id}/watch`);
  };

  const mediaType = movie.media_type || "movie";
  
  const categories = [
    mediaType.toUpperCase(),
    "Action",
    "Comedy",
    "Horror",
    "Romance",
    "Thriller",
    "Animation",
    "Drama",
    "Sci-Fi"
  ].filter(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-netflix-black text-white overflow-y-auto max-h-[90vh] w-[95vw] sm:w-[85vw] md:w-[90vw]">
        <div className="relative">
          <img
            src={getImageUrl(movie.backdrop_path || movie.poster_path, "original")}
            alt={movie.title || movie.name}
            className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-netflix-black" />
          <div className="absolute bottom-0 left-0 p-4 md:p-6 space-y-2 md:space-y-4 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold line-clamp-2">{movie.title || movie.name}</h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link
                to={`/${movie.media_type || "movie"}/${movie.id}/watch`}
                className="flex items-center gap-1 sm:gap-2 bg-white text-black px-3 sm:px-6 py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-gray-200 transition"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" /> Play
              </Link>
              {!isInList ? (
                <button 
                  onClick={handleAddToList}
                  className="flex items-center gap-1 sm:gap-2 bg-gray-500/70 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-gray-500/50 transition"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> My List
                </button>
              ) : (
                <button 
                  onClick={handleRemoveFromList}
                  className="flex items-center gap-1 sm:gap-2 bg-gray-500/70 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm sm:text-base hover:bg-gray-500/50 transition"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" /> Remove
                </button>
              )}
              <button 
                onClick={handleLike}
                className="flex items-center gap-1 sm:gap-2 bg-gray-500/70 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-500/50 transition"
              >
                <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4 md:p-6 space-y-6">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="text-green-500">97% Match</span>
              <span>{movie.release_date?.split("-")[0]}</span>
              <span className="border px-1">HD</span>
            </div>
            <p className="text-sm sm:text-base text-gray-200">{movie.overview}</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  className="cursor-pointer hover:bg-primary/80 text-xs sm:text-sm"
                  onClick={() => handleCategoryClick(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          {similarMovies && similarMovies.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold">Similar Titles</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                {similarMovies.slice(0, 4).map((similar) => (
                  <div 
                    key={similar.id} 
                    className="space-y-1 sm:space-y-2 cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => handleMovieClick(similar)}
                  >
                    <div className="aspect-[2/3] relative rounded-sm overflow-hidden">
                      <img
                        src={getImageUrl(similar.poster_path, "w500")}
                        alt={similar.title || similar.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs sm:text-sm line-clamp-1">{similar.title || similar.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recommendations && recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-semibold">Recommended For You</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
                {recommendations.slice(0, 4).map((recommendation) => (
                  <div 
                    key={recommendation.id} 
                    className="space-y-1 sm:space-y-2 cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => handleMovieClick(recommendation)}
                  >
                    <div className="aspect-[2/3] relative rounded-sm overflow-hidden">
                      <img
                        src={getImageUrl(recommendation.poster_path, "w500")}
                        alt={recommendation.title || recommendation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs sm:text-sm line-clamp-1">{recommendation.title || recommendation.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailsModal;