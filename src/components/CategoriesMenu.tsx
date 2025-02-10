import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const categories = {
  movies: [
    { id: "action", name: "Action" },
    { id: "comedy", name: "Comedy" },
    { id: "horror", name: "Horror" },
    { id: "thriller", name: "Thriller" },
    { id: "romance", name: "Romance" },
    { id: "drama", name: "Drama" },
    { id: "scifi", name: "Sci-Fi" },
    { id: "animation", name: "Animation" },
    { id: "adventure", name: "Adventure" },
    { id: "crime", name: "Crime" },
    { id: "documentary", name: "Documentary" },
    { id: "family", name: "Family" },
    { id: "fantasy", name: "Fantasy" },
  ],
  shows: [
    { id: "tv", name: "All TV Shows" },
    { id: "kdrama", name: "K-Dramas" },
    { id: "anime", name: "Anime" },
  ]
};

const CategoriesMenu = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-white hover:text-gray-300">
        Categories
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black/95 text-white border-gray-800">
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-400">Movies</div>
        {categories.movies.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="cursor-pointer hover:bg-gray-800"
          >
            {category.name}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-gray-800" />
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-400">TV Shows</div>
        {categories.shows.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className="cursor-pointer hover:bg-gray-800"
          >
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CategoriesMenu; 