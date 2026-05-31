import mainLogo from "../../assets/main-icon.png";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "../../context/LocationContext";
import { useTheme } from "../../context/ThemeContext";
import map from "../../assets/pin.gif";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { location, loading, error } = useLocation();
  const { darkMode, toggleTheme } = useTheme();
  const Navigate = useNavigate();

  return (
    <div className="w-full text-sm bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800/50 transition-colors duration-300">
      {/* Top Navbar */}
      <div className="px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3">
          
          {/* Left Part */}
          <div className="flex items-center space-x-4">
            <img
              onClick={() => Navigate("/")}
              src={mainLogo}
              alt="logo"
              className="h-8 object-contain cursor-pointer transition-transform hover:scale-105 dark:brightness-110"
            />

            <div className="relative">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="border border-gray-300 dark:border-gray-600 rounded-full px-4 py-1.5 w-[500px] text-sm outline-none transition-all duration-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 bg-white dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400"
              />
              <FaSearch className="absolute right-4 top-2.5 text-gray-400" />
            </div>
          </div>

          {/* Right Part */}
          <div className="flex items-center space-x-6">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              style={{
                background: darkMode
                  ? "linear-gradient(135deg, #1e1b4b, #4c1d95)"
                  : "linear-gradient(135deg, #fbbf24, #f59e0b)",
              }}
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-sm transition-all duration-300 ${
                  darkMode ? "left-7.5" : "left-0.5"
                }`}
              >
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>

            <div className="text-sm font-medium cursor-pointer flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-400 transition-colors">
              {loading && <p>Detecting location...</p>}
              {error && <p className="text-red-500">{error}</p>}

              {location && (
                <>
                  <img src={map} alt="map" className="w-6 h-6" />
                  <p>{location} ▼</p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 px-4 md:px-8 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-2 text-gray-700 dark:text-gray-300">
          
          <div className="flex items-center space-x-6 font-medium">
            <span onClick={() => Navigate("/movies")} className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Movies</span>
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Stream</span>
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Events</span>
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Plays</span>
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Sports</span>
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Activities</span>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">ListYourShow</span>
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Corporates</span>
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Offers</span>
            <span className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Gift Cards</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;
