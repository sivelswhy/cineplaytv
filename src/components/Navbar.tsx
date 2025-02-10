import { Search, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchContent } from "@/lib/tmdb";
import { toast } from "sonner";
import MovieDetailsModal from "./MovieDetailsModal";
import NotificationsMenu from "./NotificationsMenu";
import CategoriesMenu from "./CategoriesMenu";
import MobileMenu from "./MobileMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  const { data: searchResults } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchContent(searchQuery),
    enabled: searchQuery.length > 2,
  });

  // Add click outside handler to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setIsSearchOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path: string) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    navigate(path);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.length >= 2) {
        handleNavigation(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
    if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        document.querySelector<HTMLInputElement>('.search-input')?.focus();
      }, 100);
    } else {
      setSearchQuery("");
    }
  };

  const handleMovieSelect = (movie: any) => {
    setSelectedMovie(movie);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const showMyList = () => {
    navigate("/my-list");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black/80 to-transparent px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4 md:gap-8">
          <Link to="/" className="text-red-600 text-2xl md:text-3xl font-bold">
            CINEPLAY
          </Link>
          <MobileMenu />
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => handleNavigation("/")} className="text-white hover:text-gray-300">
              Home
            </button>
            <button onClick={() => handleNavigation("/category/tv")} className="text-white hover:text-gray-300">
              TV Shows
            </button>
            <button onClick={() => handleNavigation("/category/movie")} className="text-white hover:text-gray-300">
              Movies
            </button>
            <CategoriesMenu />
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative search-container">
            <div className="flex items-center">
              {isSearchOpen && (
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input bg-black/80 text-white px-4 py-2 rounded-l border-r border-gray-700 w-[140px] sm:w-[200px] md:w-[300px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={handleSearchKeyPress}
                  autoFocus
                />
              )}
              <button
                className={`p-2 ${isSearchOpen ? 'bg-black/80 rounded-r' : 'rounded'} hover:bg-white/10 transition-colors`}
                onClick={toggleSearch}
                title="Toggle search"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6 text-white hover:text-gray-300" />
              </button>
            </div>
            {isSearchOpen && searchResults && searchResults.length > 0 && searchQuery.length > 2 && (
              <div className="absolute top-full right-0 mt-2 w-screen sm:w-full max-w-[90vw] sm:max-w-none bg-black/95 rounded-lg shadow-lg z-[100] max-h-[60vh] overflow-y-auto border border-gray-800">
                <div className="p-3 border-b border-gray-800">
                  <button
                    onClick={() => handleNavigation(`/search?q=${encodeURIComponent(searchQuery)}`)}
                    className="w-full text-left text-sm text-blue-400 hover:text-blue-300"
                  >
                    See all results for "{searchQuery}"
                  </button>
                </div>
                {searchResults.slice(0, 5).map((result: any) => (
                  <div
                    key={result.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800 last:border-none"
                    onClick={() => handleMovieSelect(result)}
                  >
                    {result.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                        alt={result.title || result.name}
                        className="w-12 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{result.title || result.name}</p>
                      <p className="text-gray-400 text-sm truncate">
                        {result.media_type === 'movie' ? 'Movie' : 'TV Show'}
                        {result.media_type === 'tv' && result.number_of_episodes && (
                          <span className="ml-2">({result.number_of_episodes} episodes)</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <NotificationsMenu />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none" title="User menu">
                <User className="w-6 h-6 text-white hover:text-gray-300" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-black/90 text-white border-gray-700">
              <DropdownMenuItem onClick={showMyList} className="cursor-pointer hover:bg-gray-800">
                My List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info("Account settings coming soon!")} className="cursor-pointer hover:bg-gray-800">
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigation("/legal")} className="cursor-pointer hover:bg-gray-800">
                Legal Disclaimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </nav>
  );
};

export default Navbar;