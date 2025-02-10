import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryRow from "@/components/CategoryRow";
import TopTenRow from "@/components/TopTenRow";
import Footer from "@/components/Footer";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import {
  getPopular,
  getNewReleases,
  getMoviesByGenre,
  getKDramas,
  getTVShows,
  getTrending,
  type Movie,
  type MovieResponse,
} from "@/lib/tmdb";

const GENRE_IDS = {
  horror: "27",
  scifi: "878",
  animation: "16",
  thriller: "53",
  romance: "10749",
  action: "28",
  comedy: "35",
  drama: "18"
};

const Index = () => {
  const { data: popularMovies } = useQuery<Movie[]>({
    queryKey: ["popular"],
    queryFn: async () => {
      const response = await getPopular();
      return response.results;
    },
  });

  const { data: newReleases } = useQuery<Movie[]>({
    queryKey: ["new-releases"],
    queryFn: getNewReleases,
  });

  const { data: kdramas } = useQuery<Movie[]>({
    queryKey: ["kdramas"],
    queryFn: getKDramas,
  });

  const { data: tvShows } = useQuery<Movie[]>({
    queryKey: ["tvshows"],
    queryFn: async () => {
      const response = await getTVShows();
      return response.results;
    },
  });

  const { data: trending } = useQuery<Movie[]>({
    queryKey: ["trending"],
    queryFn: getTrending,
  });

  // Genre-specific queries
  const { data: horrorMovies } = useQuery<MovieResponse>({
    queryKey: ["genre", GENRE_IDS.horror],
    queryFn: () => getMoviesByGenre(GENRE_IDS.horror),
  });

  const { data: actionMovies } = useQuery<MovieResponse>({
    queryKey: ["genre", GENRE_IDS.action],
    queryFn: () => getMoviesByGenre(GENRE_IDS.action),
  });

  const { data: scifiMovies } = useQuery<MovieResponse>({
    queryKey: ["genre", GENRE_IDS.scifi],
    queryFn: () => getMoviesByGenre(GENRE_IDS.scifi),
  });

  const { data: animationMovies } = useQuery<MovieResponse>({
    queryKey: ["genre", GENRE_IDS.animation],
    queryFn: () => getMoviesByGenre(GENRE_IDS.animation),
  });

  const { data: thrillerMovies } = useQuery<MovieResponse>({
    queryKey: ["genre", GENRE_IDS.thriller],
    queryFn: () => getMoviesByGenre(GENRE_IDS.thriller),
  });

  const { data: romanceMovies } = useQuery<MovieResponse>({
    queryKey: ["genre", GENRE_IDS.romance],
    queryFn: () => getMoviesByGenre(GENRE_IDS.romance),
  });

  return (
    <div className="min-h-screen bg-netflix-black">
      <Navbar />
      <AnnouncementBanner />
      <Hero />
      <div className="space-y-8 pb-8">
        {trending && trending.length > 0 && (
          <TopTenRow title="Top 10 Today" movies={trending} />
        )}
        {popularMovies && popularMovies.length > 0 && (
          <CategoryRow title="Popular Movies" movies={popularMovies} />
        )}
        {newReleases && newReleases.length > 0 && (
          <CategoryRow title="New Releases" movies={newReleases} />
        )}
        {kdramas && kdramas.length > 0 && (
          <CategoryRow title="K-Dramas" movies={kdramas} />
        )}
        {tvShows && tvShows.length > 0 && (
          <CategoryRow title="TV Shows" movies={tvShows} />
        )}
        {horrorMovies?.results && horrorMovies.results.length > 0 && (
          <CategoryRow title="Horror" movies={horrorMovies.results} />
        )}
        {actionMovies?.results && actionMovies.results.length > 0 && (
          <CategoryRow title="Action & Adventure" movies={actionMovies.results} />
        )}
        {scifiMovies?.results && scifiMovies.results.length > 0 && (
          <CategoryRow title="Sci-Fi & Fantasy" movies={scifiMovies.results} />
        )}
        {animationMovies?.results && animationMovies.results.length > 0 && (
          <CategoryRow title="Animation" movies={animationMovies.results} />
        )}
        {thrillerMovies?.results && thrillerMovies.results.length > 0 && (
          <CategoryRow title="Thriller" movies={thrillerMovies.results} />
        )}
        {romanceMovies?.results && romanceMovies.results.length > 0 && (
          <CategoryRow title="Romance" movies={romanceMovies.results} />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Index;