import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { categories } from "./CategoriesMenu";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white"
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-50">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-white">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-white"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Main Navigation */}
              <div className="p-4 border-b border-gray-800">
                <button
                  onClick={() => handleNavigation("/")}
                  className="w-full text-left py-3 text-white hover:text-gray-300"
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("/category/tv")}
                  className="w-full text-left py-3 text-white hover:text-gray-300"
                >
                  TV Shows
                </button>
                <button
                  onClick={() => handleNavigation("/category/movie")}
                  className="w-full text-left py-3 text-white hover:text-gray-300"
                >
                  Movies
                </button>
              </div>

              {/* Movie Categories */}
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Movies</h3>
                {categories.movies.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleNavigation(`/category/${category.id}`)}
                    className="w-full text-left py-2 text-white hover:text-gray-300"
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              {/* TV Show Categories */}
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">TV Shows</h3>
                {categories.shows.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleNavigation(`/category/${category.id}`)}
                    className="w-full text-left py-2 text-white hover:text-gray-300"
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu; 