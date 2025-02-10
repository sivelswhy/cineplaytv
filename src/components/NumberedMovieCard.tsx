import { useState } from "react";
import { Star } from "lucide-react";
import MovieDetailsModal from "./MovieDetailsModal";
import { Image } from "./ui/image";

interface NumberedMovieCardProps {
  id: number;
  title: string;
  poster_path: string;
  media_type?: string;
  overview?: string;
  backdrop_path?: string;
  release_date?: string;
  vote_average?: number;
  index: number;
  recently_added?: boolean;
}

const NumberedMovieCard = ({ id, title, poster_path, media_type = "movie", index, release_date, vote_average, recently_added, ...rest }: NumberedMovieCardProps) => {
  const [showModal, setShowModal] = useState(false);
  
  // Use smaller image size for thumbnails
  const imageUrl = poster_path 
    ? `https://image.tmdb.org/t/p/w342${poster_path}` // w342 is more appropriate for thumbnails than w500
    : "/placeholder.svg";
  
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const year = release_date ? new Date(release_date).getFullYear() : null;
  const rating = vote_average ? Number((vote_average).toFixed(1)) : null;
  
  return (
    <>
      <div className="relative w-full h-full">
        {/* Background Number */}
        <div className="absolute inset-0 flex items-center justify-end pr-[35%]">
          <span 
            className="text-[100px] xs:text-[120px] sm:text-[140px] md:text-[160px] lg:text-[180px] xl:text-[200px] font-black leading-none"
            style={{
              color: '#000000',
              WebkitTextStroke: '1px #666666',
              fontFamily: 'Netflix Sans, Arial Black, sans-serif',
              letterSpacing: '-4px'
            }}
          >
            {index + 1}
          </span>
        </div>
        
        {/* Movie Poster Container - overlapping the number */}
        <div className="relative w-[45%] ml-auto z-10">
          <div 
            onClick={handleCardClick}
            className="numbered-movie-card cursor-pointer group"
          >
            <Image
              src={imageUrl}
              alt={title}
              className="w-full h-full rounded-sm"
              priority={index < 3} // Eagerly load first 3 items
            />
            {/* Recently Added Badge */}
            {recently_added && (
              <div className="absolute top-2 left-0 right-0 flex justify-center">
                <div className="bg-red-600 text-[8px] xs:text-[10px] text-white px-2 py-0.5 font-medium rounded">
                  Recently Added
                </div>
              </div>
            )}
            {/* Info Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-3">
              <span className="text-white text-[10px] sm:text-xs font-medium line-clamp-2 mb-1 font-sans">{title}</span>
              <div className="flex items-center gap-2 text-[8px] sm:text-[10px] text-gray-300 font-sans">
                {rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                    <span>{rating}</span>
                  </div>
                )}
                {year && <span>{year}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MovieDetailsModal
        movie={{ id, title, poster_path, media_type, release_date, vote_average, ...rest }}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}

export default NumberedMovieCard; 