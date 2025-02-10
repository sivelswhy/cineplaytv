import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMovieDetails, getTVDetails, getSeasonDetails, type Episode, searchContent, addToList, removeFromList, isInMyList } from "@/lib/tmdb";
import { AlertCircle, ArrowLeft, ArrowRight, Home, Plus, Search, Settings, Volume2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const servers = [
  { id: "vidlink", name: "VidLink", domain: "https://vidlink.pro", priority: 0 },
  { id: "vidpro", name: "VidPro", domain: "https://embed.su", priority: 0 },
  { id: "vidsrc", name: "VidSrc", domain: "https://vidsrc.xyz", priority: 3 },
  { id: "vidsrc_cc", name: "VidSrc CC", domain: "https://vidsrc.cc", priority: 3 },
  { id: "moviesapi", name: "MoviesApi", domain: "https://moviesapi.club", priority: 0 },
  { id: "autoembed", name: "AutoEmbed", domain: "https://player.autoembed.cc", priority: 1 },
  { id: "superembed", name: "SuperEmbed", domain: "https://multiembed.mov", priority: 1 },
  { id: "filmku", name: "Filmku", domain: "https://filmku.stream", priority: 3 },
  { id: "rgshows", name: "RgShows (Multi-Lang)", domain: "https://embed.rgshows.me", priority: 0 },
  { id: "onemovies", name: "OneMovies", domain: "https://111movies.com", priority: 3 },
  { id: "smashy", name: "Smashy", domain: "https://player.smashy.stream", priority: 2 },
  { id: "vidsrc_pro", name: "VidSrc Pro", domain: "https://vidsrc.me/embed", priority: 3 },
];

const Watch = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { type, id } = useParams();
  const [season, setSeason] = useState("1");
  const [episode, setEpisode] = useState("1");
  const [selectedServer, setSelectedServer] = useState("vidpro");
  const [showEpisodes, setShowEpisodes] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [watchProgress, setWatchProgress] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isInList, setIsInList] = useState(false);

  const { data: searchResults } = useQuery({
    queryKey: ["search", searchQuery],
    queryFn: () => searchContent(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const { data: details, error } = useQuery({
    queryKey: ["details", type, id],
    queryFn: () => (type === "tv" ? getTVDetails(id!) : getMovieDetails(id!)),
    retry: false,
  });

  const { data: seasonDetails } = useQuery({
    queryKey: ["season", id, season],
    queryFn: () => getSeasonDetails(id!, season),
    enabled: type === "tv",
  });

  const nextEpisodeNumber = parseInt(episode) + 1;
  const hasNextEpisode = seasonDetails?.episodes?.some(ep => ep.episode_number === nextEpisodeNumber);

  useEffect(() => {
    if (error) {
      toast.error("Content not found");
    }
  }, [error]);

  useEffect(() => {
    setVideoError(false);
    setNetworkError(false);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  }, [selectedServer]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'videoEnded' && hasNextEpisode) {
        setEpisode(nextEpisodeNumber.toString());
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [hasNextEpisode, nextEpisodeNumber]);

  useEffect(() => {
    setIsLoading(true);
  }, [episode, season]);

  useEffect(() => {
    const handleWatchProgress = (event: MessageEvent) => {
      if (event.origin !== 'https://vidlink.pro') return;
      
      if (event.data?.type === 'MEDIA_DATA') {
        const mediaData = event.data.data;
        localStorage.setItem('vidLinkProgress', JSON.stringify(mediaData));
        setWatchProgress(mediaData);
      }

      if (event.data?.type === 'PLAYER_EVENT') {
        const { event: eventType, currentTime, duration } = event.data.data;
        if (eventType === 'ended' && hasNextEpisode) {
          setEpisode(nextEpisodeNumber.toString());
        }
      }
    };

    window.addEventListener('message', handleWatchProgress);
    return () => window.removeEventListener('message', handleWatchProgress);
  }, [hasNextEpisode, nextEpisodeNumber]);

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

  useEffect(() => {
    if (id) {
      setIsInList(isInMyList(parseInt(id)));
    }
  }, [id]);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.length >= 2) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
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

  const handleBack = () => {
    navigate("/");
  };

  const getEmbedUrl = (server: string) => {
    const serverConfig = servers.find(s => s.id === server);
    if (!serverConfig) return servers[0].domain;

    const { domain } = serverConfig;
    
    switch (server) {
      case "vidlink":
        const params = new URLSearchParams({
          primaryColor: '63b8bc',
          secondaryColor: 'a2a2a2',
          iconColor: 'eefdec',
          icons: 'default',
          player: 'default',
          title: 'true',
          poster: 'true',
          autoplay: 'true',
          nextbutton: type === 'tv' ? 'true' : 'false'
        }).toString();
        
        return type === "tv"
          ? `${domain}/tv/${id}/${season}/${episode}?${params}`
          : `${domain}/movie/${id}?${params}`;
      case "moviesapi":
        return type === "tv"
          ? `${domain}/tv/${id}-${season}-${episode}`
          : `${domain}/movie/${id}`;
      case "vidsrc_pro":
        return type === "tv"
          ? `${domain}/tv?id=${id}&s=${season}&e=${episode}`
          : `${domain}/movie?id=${id}`;
      case "superembed":
        return type === "tv"
          ? `${domain}/?video_id=${id}&tmdb=1&s=${season}&e=${episode}`
          : `${domain}/?video_id=${id}&tmdb=1`;
      case "autoembed":
        return type === "tv"
          ? `${domain}/embed/tv/${id}/${season}/${episode}`
          : `${domain}/embed/movie/${id}`;
      case "vidsrc_cc":
        return type === "tv"
          ? `${domain}/embed/tv/${id}/${season}/${episode}`
          : `${domain}/embed/movie/${id}`;
      case "smashy":
        return type === "tv"
          ? `${domain}/tv/${id}?s=${season}&e=${episode}`
          : `${domain}/movie/${id}`;
      case "rgshows":
        return type === "tv"
          ? `${domain}/api/2/tv/?id=${id}&s=${season}&e=${episode}`
          : `${domain}/api/2/movie/?id=${id}`;
      case "onemovies":
        return type === "tv"
          ? `${domain}/tv/${id}/${season}/${episode}`
          : `${domain}/movie/${id}`;
      default:
        return type === "tv"
          ? `${domain}/embed/tv/${id}/${season}/${episode}`
          : `${domain}/embed/movie/${id}`;
    }
  };

  const handleVideoLoad = () => {
    setIsLoading(false);
    setVideoError(false);
    setNetworkError(false);
  };

  const handleVideoError = () => {
    setIsLoading(false);
    setVideoError(true);
  };

  const handleSearchSelect = (result: any) => {
    setSearchQuery("");
    setIsSearchOpen(false);
    navigate(`/${result.media_type || "movie"}/${result.id}/watch`);
  };

  useEffect(() => {
    const handleNetworkError = () => {
      if (!navigator.onLine) {
        setNetworkError(true);
        setVideoError(false);
        setIsLoading(false);
      } else {
        setNetworkError(false);
      }
    };

    window.addEventListener('online', handleNetworkError);
    window.addEventListener('offline', handleNetworkError);
    window.addEventListener('error', (e) => {
      if (e.message.includes('NetworkError') || e.message.includes('fetch')) {
        setNetworkError(true);
        setVideoError(false);
        setIsLoading(false);
      }
    });

    return () => {
      window.removeEventListener('online', handleNetworkError);
      window.removeEventListener('offline', handleNetworkError);
    };
  }, []);

  const handleAddToList = async () => {
    try {
      await addToList("myList", parseInt(id!), type as 'movie' | 'tv');
      setIsInList(true);
      queryClient.invalidateQueries({ queryKey: ["myList"] });
      toast.success("Added to My List");
    } catch (error) {
      toast.error("Failed to add to list. Please try again.");
    }
  };

  const handleRemoveFromList = async () => {
    try {
      await removeFromList("myList", parseInt(id!), type as 'movie' | 'tv');
      setIsInList(false);
      queryClient.invalidateQueries({ queryKey: ["myList"] });
      toast.success("Removed from My List");
    } catch (error) {
      toast.error("Failed to remove from list. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
        <h1 className="text-white text-2xl mb-4">Content Not Found</h1>
        <Button onClick={handleBack} variant="outline" className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${type === "tv" && showEpisodes ? 'lg:mr-[350px]' : ''}`}>
        {/* Top Navigation */}
        <div className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-3 sm:gap-4">
            <button 
              onClick={handleBack}
              className="hover:text-gray-300 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-white/5"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {!isInList ? (
              <button 
                onClick={handleAddToList}
                className="hover:text-gray-300 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-white/5"
                title="Add to my list"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button 
                onClick={handleRemoveFromList}
                className="hover:text-gray-300 transition-colors p-1.5 sm:p-2 rounded-full hover:bg-white/5"
                title="Remove from my list"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            <h1 className="text-base sm:text-xl font-medium tracking-wide line-clamp-1">{details?.title || details?.name}</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative search-container">
              <div className="flex items-center">
                {isSearchOpen && (
                  <input
                    type="text"
                    placeholder="Search..."
                    className="search-input bg-black/80 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-l border-0 w-[140px] sm:w-[200px] md:w-[300px] text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                    value={searchQuery}
                    onChange={handleSearchInput}
                    onKeyDown={handleSearchKeyPress}
                    autoFocus
                  />
                )}
                <button
                  className={`p-1.5 sm:p-2 ${isSearchOpen ? 'bg-black/80 rounded-r' : 'rounded-full'} hover:bg-white/5 transition-colors`}
                  onClick={toggleSearch}
                  title="Toggle search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              {isSearchOpen && searchResults && searchResults.length > 0 && searchQuery.length > 2 && (
                <div className="absolute top-full right-0 mt-2 w-full bg-black/95 rounded-lg shadow-xl z-[100] max-h-[60vh] overflow-y-auto border border-white/10">
                  <div className="p-3 border-b border-gray-800">
                    <button
                      onClick={() => navigate(`/search?q=${encodeURIComponent(searchQuery)}`)}
                      className="w-full text-left text-sm text-blue-400 hover:text-blue-300"
                    >
                      See all results for "{searchQuery}"
                    </button>
                  </div>
                  {searchResults.slice(0, 5).map((result: any) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800 last:border-none"
                      onClick={() => handleSearchSelect(result)}
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
            <button 
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/5 transition-colors" 
              aria-label="Settings"
            >
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Container */}
        <div className="flex-1 relative bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black gap-3">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-white/20 border-t-white"></div>
              <p className="text-xs sm:text-sm text-gray-400">Loading {servers.find(s => s.id === selectedServer)?.name}...</p>
            </div>
          )}
          
          {videoError && !networkError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-center p-4">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Playback Error</h3>
              <p className="text-xs sm:text-sm text-gray-400">This server is not responding. Please try another server below.</p>
            </div>
          )}

          {networkError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/95 text-center p-4">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mb-2 sm:mb-3" />
              <h3 className="text-base sm:text-lg font-medium mb-1 sm:mb-2">Network Error</h3>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-gray-400">Unable to connect to the streaming service.</p>
                <p className="text-xs sm:text-sm text-gray-400">Please check your internet connection and try:</p>
                <ul className="text-xs sm:text-sm text-gray-400 list-disc list-inside">
                  <li>Refreshing the page</li>
                  <li>Using a different server</li>
                  <li>Disabling VPN/Proxy if you're using one</li>
                </ul>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-sm transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          )}
          
          <iframe
            key={iframeKey}
            src={getEmbedUrl(selectedServer)}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen; picture-in-picture"
            scrolling="no"
            onLoad={handleVideoLoad}
            onError={handleVideoError}
          />
        </div>

        {/* Server Selection - Mobile Optimized */}
        <div className="bg-black/40 p-3 sm:p-6">
          <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">If current server doesn't work, please try another server below</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {servers
              .sort((a, b) => a.priority - b.priority)
              .map((server) => (
                <button
                  key={server.id}
                  onClick={() => setSelectedServer(server.id)}
                  className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedServer === server.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : server.priority === 0
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90"
                      : server.priority === 1
                      ? "bg-black/60 hover:bg-black/80 text-white border border-white/10"
                      : "bg-black/40 hover:bg-black/60 text-gray-300 border border-white/5"
                  }`}
                >
                  {server.name}
                  {server.priority === 0 && (
                    <span className="ml-1.5 text-[8px] sm:text-[10px] bg-yellow-500/90 text-black px-1 sm:px-1.5 py-0.5 rounded-sm font-bold">
                      PREMIUM
                    </span>
                  )}
                  {server.priority === 1 && (
                    <span className="ml-1.5 text-[8px] sm:text-[10px] bg-green-500/90 text-white px-1 sm:px-1.5 py-0.5 rounded-sm font-bold">
                      HD
                    </span>
                  )}
                </button>
            ))}
          </div>

          <div className="text-xs sm:text-sm text-gray-400/80 border-t border-white/5 pt-3 sm:pt-4">
            <Link to="/legal" className="hover:text-gray-300 transition-colors">
              CinePlay does not host any files, it only links to 3rd party services. Legal issues should be taken up with the file hosts and providers.
            </Link>
          </div>
        </div>
      </div>

      {/* Episode Sidebar - Mobile Optimized */}
      {type === "tv" && (
        <div className={`fixed right-0 top-0 bottom-0 w-full sm:w-[350px] bg-[#0a0a0a] border-l border-white/5 transition-transform duration-300 ${showEpisodes ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-4 border-b border-white/5 bg-black/40">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium tracking-wide">Episodes</h2>
              <button 
                onClick={() => setShowEpisodes(false)} 
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
                aria-label="Close episode list"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/5">
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Current Season</h3>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger className="w-full bg-black/40 hover:bg-black/60 border-0 px-4 py-3 font-medium focus:ring-0 [&>svg]:hidden">
                  <div className="flex items-center justify-between w-full">
                    <span>Season {season}</span>
                    <span className="text-sm text-gray-400">▾</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  {Array.from({ length: details?.number_of_seasons || 1 }, (_, i) => (
                    <SelectItem 
                      key={i + 1} 
                      value={(i + 1).toString()}
                      className="hover:bg-white/10 focus:bg-white/10 cursor-pointer py-2"
                    >
                      Season {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100vh-200px)] episodes-list">
            {seasonDetails?.episodes?.map((ep: Episode) => (
              <button
                key={ep.id}
                onClick={() => setEpisode(ep.episode_number.toString())}
                className={`w-full p-4 flex items-start gap-4 hover:bg-white/5 transition-colors border-b border-white/5 ${
                  ep.episode_number.toString() === episode ? 'bg-white/10' : ''
                }`}
              >
                <div className="w-32 h-20 bg-black/60 rounded-md overflow-hidden relative flex-shrink-0">
                  {ep.still_path ? (
                    <img 
                      src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                      alt={`Episode ${ep.episode_number}`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/40">
                      EP {ep.episode_number}
                    </div>
                  )}
                  {ep.episode_number.toString() === episode && (
                    <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm" />
                  )}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm text-gray-400">E{ep.episode_number}</span>
                    <h3 className="font-medium truncate">{ep.name}</h3>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{ep.overview}</p>
                </div>
                {ep.episode_number.toString() === episode && (
                  <div className="w-1 h-20 bg-blue-600 absolute right-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Toggle Episodes Button - Mobile Optimized */}
      {type === "tv" && !showEpisodes && (
        <button
          onClick={() => setShowEpisodes(true)}
          className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-1.5 sm:p-2 rounded-l transition-colors"
          aria-label="Show episode list"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
};

export default Watch;