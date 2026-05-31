import React from "react";
import { languages } from "../../utils/constants";

const MovieFilters = () => {
  return (
    <div className="w-full md:w-1/4 p-4 space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Filters</h2>

      {/* Language */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-gray-700 dark:text-gray-200">Languages</span>
          <button className="text-purple-600 dark:text-purple-400 text-sm hover:text-purple-800 dark:hover:text-purple-300 transition-colors">Clear</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {languages.map((lang, i) => (
            <span
              key={i}
              className="border border-gray-200 dark:border-gray-600 text-purple-600 dark:text-purple-400 px-3 py-1 text-sm rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:border-purple-300 dark:hover:border-purple-500 cursor-pointer transition-all duration-200"
            >
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* Genres Block */}
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mt-3 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
  <div className="flex justify-between items-center mb-2">
    <span className="font-semibold text-gray-700 dark:text-gray-200">Genres</span>
    <button className="text-purple-600 dark:text-purple-400 text-sm hover:text-purple-800 dark:hover:text-purple-300 transition-colors">Clear</button>
  </div>
</div>

{/* Format Block */}
<div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm -mt-3 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
  <div className="flex justify-between items-center mb-2">
    <span className="font-semibold text-gray-700 dark:text-gray-200">Format</span>
    <button className="text-purple-600 dark:text-purple-400 text-sm hover:text-purple-800 dark:hover:text-purple-300 transition-colors">Clear</button>
  </div>
</div>

   <button
  className="
    w-full
    border-2 border-purple-500
    cursor-pointer
    py-2
    rounded-xl
    text-purple-600 dark:text-purple-400 font-semibold
    hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500
    hover:text-white
    transition-all duration-300
  "
>
  Browse by Cinemas
</button>


    </div>
  );
};

export default MovieFilters;
