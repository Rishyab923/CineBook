import React from "react";
import { languages } from "../../utils/constants";
import MovieCard from "./MovieCard";

const MovieList = ({ allMovies = [] }) => {
  const movies = Array.isArray(allMovies) ? allMovies : [];

  return (
    <div className="w-full md:w-3/4 p-4">
      {/* Language Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {languages.map((lang, i) => (
          <span
            key={i}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 py-1.5 px-4 rounded-full text-sm cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-200 shadow-sm dark:shadow-gray-800/50"
          >
            {lang}
          </span>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="flex justify-between items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-6 rounded-xl mb-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Coming Soon</h3>
        <a
          href="#"
          className="text-purple-600 dark:text-purple-400 text-sm font-semibold flex items-center hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
        >
          Explore Upcoming Movies <span className="ml-1">→</span>
        </a>
      </div>

      {/* Movie Cards */}
      <div className="flex flex-wrap gap-6">
        {movies.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No movies available</p>
        ) : (
          movies.map((movie, i) => (
            <MovieCard key={movie._id || i} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default MovieList;
