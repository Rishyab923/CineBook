import mainLogo from "../../assets/main-icon.png";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "../../context/LocationContext";
import map from "../../assets/pin.gif";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { location, loading, error } = useLocation();
  const Navigate = useNavigate();

  return (
    <div className="w-full text-sm bg-white">
      {/* Top Navbar */}
      <div className="px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3">
          
          {/* Left Part */}
          <div className="flex items-center space-x-4">
            <img
              onClick={() => Navigate("/")}
              src={mainLogo}
              alt="logo"
              className="h-8 object-contain cursor-pointer"
            />

            <div className="relative">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                className="border border-gray-300 rounded px-4 py-1.5 w-[500px] text-sm outline-none"
              />
              <FaSearch className="absolute right-3 top-2.5 text-gray-500" />
            </div>
          </div>

          {/* Right Part */}
          <div className="flex items-center space-x-6">
            <div className="text-sm font-medium cursor-pointer flex items-center gap-2">
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
      <div className="bg-[#f2f2f2] px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-2 text-gray-700">
          
          <div className="flex items-center space-x-6 font-medium">
            <span onClick={() => Navigate("/movies")} className="cursor-pointer hover:text-red-500">Movies</span>
            <span className="cursor-pointer hover:text-red-500">Stream</span>
            <span className="cursor-pointer hover:text-red-500">Events</span>
            <span className="cursor-pointer hover:text-red-500">Plays</span>
            <span className="cursor-pointer hover:text-red-500">Sports</span>
            <span className="cursor-pointer hover:text-red-500">Activities</span>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <span className="cursor-pointer hover:underline">ListYourShow</span>
            <span className="cursor-pointer hover:underline">Corporates</span>
            <span className="cursor-pointer hover:underline">Offers</span>
            <span className="cursor-pointer hover:underline">Gift Cards</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Header;
