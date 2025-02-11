import axios from 'axios';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  media_type?: string;
  release_date?: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
  recently_added?: boolean;
  vote_average?: number;
}

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

export const searchContent = async (query: string): Promise<Movie[]> => {
  // Fetch first 5 pages (100 results)
  const pages = await Promise.all(
    Array.from({ length: 5 }, (_, i) =>
      axios.get<MovieResponse>(
        `${BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${i + 1}`
      )
    )
  );

  // Combine all results
  const allResults = pages.flatMap(response => response.data.results);
  
  // Filter out items without posters and return up to 100 results
  return allResults
    .filter(item => item.poster_path)
    .slice(0, 100);
};

export const getTrending = async (): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/trending/all/day?api_key=${TMDB_API_KEY}`
  );
  return response.data.results;
};

export const getPopular = async (sortBy: string = "popularity.desc", page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=${sortBy}&page=${page}&vote_count.gte=100`
  );
  return response.data;
};

export const getNewReleases = async (): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`
  );
  return response.data.results;
};

export const getMoviesByGenre = async (genreId: string, page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}&vote_count.gte=100`
  );
  return response.data;
};

export const getTVShows = async (sortBy: string = "popularity.desc", page: number = 1): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&sort_by=${sortBy}&page=${page}&vote_count.gte=100&with_original_language=en`
  );
  return response.data;
};

export const getKDramas = async (): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&with_original_language=ko&sort_by=popularity.desc`
  );
  return response.data.results;
};

export const getMovieDetails = async (id: string): Promise<Movie> => {
  const response = await axios.get<Movie>(
    `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
  );
  return response.data;
};

export const getTVDetails = async (id: string): Promise<Movie> => {
  const response = await axios.get<Movie>(
    `${BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}`
  );
  return response.data;
};

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string;
  episode_number: number;
  air_date: string;
  vote_average: number;
}

export interface Season {
  episodes: Episode[];
}

export const getSeasonDetails = async (tvId: string, seasonNumber: string): Promise<Season> => {
  const response = await axios.get<Season>(
    `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}`
  );
  return response.data;
};

export const addToList = async (listId: string, mediaId: number, mediaType: 'movie' | 'tv') => {
  try {
    const myList = JSON.parse(localStorage.getItem('myList') || '[]');
    if (!myList.some((item: { id: number }) => item.id === mediaId)) {
      myList.push({ id: mediaId, mediaType, dateAdded: new Date().toISOString() });
      localStorage.setItem('myList', JSON.stringify(myList));
    }
    return { success: true };
  } catch (error) {
    console.error('Error adding to list:', error);
    throw new Error('Failed to add to list');
  }
};

export const removeFromList = async (listId: string, mediaId: number, mediaType: 'movie' | 'tv') => {
  try {
    const myList = JSON.parse(localStorage.getItem('myList') || '[]');
    const updatedList = myList.filter((item: { id: number }) => item.id !== mediaId);
    localStorage.setItem('myList', JSON.stringify(updatedList));
    return { success: true };
  } catch (error) {
    console.error('Error removing from list:', error);
    throw new Error('Failed to remove from list');
  }
};

export const getMyList = async (): Promise<Movie[]> => {
  try {
    const myList = JSON.parse(localStorage.getItem('myList') || '[]');
    if (myList.length === 0) return [];

    // Fetch details for each item in the list
    const moviePromises = myList.map(async (item: { id: number; mediaType: 'movie' | 'tv' }) => {
      try {
        const details = item.mediaType === 'movie' 
          ? await getMovieDetails(item.id.toString())
          : await getTVDetails(item.id.toString());
        return { ...details, media_type: item.mediaType };
      } catch (error) {
        console.error(`Error fetching details for ${item.mediaType} ${item.id}:`, error);
        return null;
      }
    });

    const movies = await Promise.all(moviePromises);
    return movies.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error('Error getting my list:', error);
    return [];
  }
};

export const isInMyList = (mediaId: number): boolean => {
  try {
    const myList = JSON.parse(localStorage.getItem('myList') || '[]');
    return myList.some((item: { id: number }) => item.id === mediaId);
  } catch {
    return false;
  }
};

interface Country {
  iso_3166_1: string;
  english_name: string;
  native_name: string;
}

export const getCountries = async (): Promise<Country[]> => {
  const response = await axios.get<Country[]>(
    `${BASE_URL}/configuration/countries?api_key=${TMDB_API_KEY}`
  );
  return response.data;
};

export const getWatchlistMovies = async (accountId: string): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/account/${accountId}/watchlist/movies?api_key=${TMDB_API_KEY}`
  );
  return response.data.results;
};

export const getWatchlistTV = async (accountId: string): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/account/${accountId}/watchlist/tv?api_key=${TMDB_API_KEY}`
  );
  return response.data.results;
};

interface List {
  id: number;
  name: string;
  description: string;
  favorite_count: number;
  item_count: number;
  iso_639_1: string;
  list_type: string;
}

export const getUserLists = async (accountId: string): Promise<List[]> => {
  const response = await axios.get<{ results: List[] }>(
    `${BASE_URL}/account/${accountId}/lists?api_key=${TMDB_API_KEY}`
  );
  return response.data.results;
};

export const getSimilarMovies = async (movieId: string): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`
  );
  return response.data.results;
};

export const getRecommendations = async (movieId: string): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}`
  );
  return response.data.results;
};

export const getImageUrl = (path: string, size: 'w500' | 'original' = 'w500') => {
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'new_content' | 'watch_progress' | 'system';
  timestamp: number;
  data?: {
    movieId?: number;
    mediaType?: 'movie' | 'tv';
    seasonNumber?: number;
    episodeNumber?: number;
  };
}

// Get upcoming movies/shows for notifications
export const getUpcoming = async (): Promise<Movie[]> => {
  const response = await axios.get<MovieResponse>(
    `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`
  );
  return response.data.results;
};

// Get latest episodes of TV shows
export const getLatestEpisodes = async (tvId: string): Promise<Episode[]> => {
  const response = await axios.get<Season>(
    `${BASE_URL}/tv/${tvId}/season/1?api_key=${TMDB_API_KEY}`
  );
  return response.data.episodes.slice(-5); // Get last 5 episodes
};

// Get watch progress for notifications
export const getWatchProgress = async (accountId: string): Promise<Movie[]> => {
  // This would normally fetch from a backend, but we'll use localStorage for now
  const progress = localStorage.getItem('watchProgress');
  return progress ? JSON.parse(progress) : [];
};

// Mock function to get notifications (in a real app, this would come from a backend)
export const getNotifications = async (): Promise<Notification[]> => {
  const upcoming = await getUpcoming();
  const notifications: Notification[] = [];

  // Convert upcoming movies to notifications
  upcoming.slice(0, 5).forEach(movie => {
    notifications.push({
      id: `upcoming-${movie.id}`,
      title: 'New Release Coming Soon',
      message: `${movie.title} will be available soon!`,
      type: 'new_content',
      timestamp: new Date(movie.release_date || '').getTime(),
      data: {
        movieId: movie.id,
        mediaType: 'movie'
      }
    });
  });

  // Add some watch progress notifications
  const progress = await getWatchProgress('default');
  progress.forEach(item => {
    notifications.push({
      id: `progress-${item.id}`,
      title: 'Continue Watching',
      message: `Continue watching ${item.title || item.name}`,
      type: 'watch_progress',
      timestamp: Date.now(),
      data: {
        movieId: item.id,
        mediaType: item.media_type as 'movie' | 'tv'
      }
    });
  });

  return notifications.sort((a, b) => b.timestamp - a.timestamp);
};
