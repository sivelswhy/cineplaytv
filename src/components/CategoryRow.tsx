import MovieCard from "./MovieCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Movie } from "@/lib/tmdb";
import { useState, useEffect, useCallback } from "react";

interface CategoryRowProps {
  title: string;
  movies: Movie[];
}

const CategoryRow = ({ title, movies }: CategoryRowProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getItemsPerPage = useCallback(() => {
    if (window.innerWidth >= 1280) return 7; // xl
    if (window.innerWidth >= 1024) return 6; // lg
    if (window.innerWidth >= 768) return 5;  // md
    if (window.innerWidth >= 640) return 4;  // sm
    return 3; // mobile
  }, []);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      const selected = api.selectedScrollSnap();
      const total = api.scrollSnapList().length;
      // Map the actual scroll position to one of the 6 bars
      setCurrentPage(Math.floor((selected / total) * 6));
    });
  }, [api]);

  if (!movies?.length) return null;

  return (
    <div 
      className="space-y-2 relative category-row-container py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-center px-[4%]">
        <h2 className="text-lg md:text-xl font-medium text-white hover:text-gray-300 transition-colors duration-200">
          {title}
        </h2>
        {(isHovered || isMobile) && movies.length > getItemsPerPage() && (
          <div className="flex gap-1.5 items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-[3px] transition-all duration-300 ${
                  i === currentPage 
                    ? 'w-[12px] bg-white' 
                    : 'w-[8px] bg-gray-600'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="relative px-[4%]">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {movies.map((movie) => (
              <CarouselItem 
                key={movie.id} 
                className="pl-2 md:pl-4 basis-1/3 sm:basis-1/4 md:basis-1/5 lg:basis-1/6 xl:basis-1/7"
              >
                <div className="movie-card-container">
                  <MovieCard
                    id={movie.id}
                    title={movie.title || movie.name || ""}
                    poster_path={movie.poster_path}
                    media_type={title === "Korean Dramas" ? "tv" : movie.media_type}
                    overview={movie.overview}
                    backdrop_path={movie.backdrop_path}
                    release_date={movie.release_date}
                    vote_average={movie.vote_average}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className={`absolute left-[2%] z-40 h-full w-[4%] bg-black/30 hover:bg-black/60 border-none rounded-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} hidden sm:flex`}
          />
          <CarouselNext 
            className={`absolute right-[2%] z-40 h-full w-[4%] bg-black/30 hover:bg-black/60 border-none rounded-none transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} hidden sm:flex`}
          />
        </Carousel>
      </div>
    </div>
  );
};

export default CategoryRow;