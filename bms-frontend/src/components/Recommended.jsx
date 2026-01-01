import React from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecommendedMovies } from "../apis";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../context/LocationContext";

const Recommended = () => {
  const navigate = useNavigate();
  const { location } = useLocation();

  const handleNavigate = (movie) => {
    const formattedTitle = movie.title
      .replace(/:/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    navigate(
      `/movies/${location}/${formattedTitle}/${movie._id}/ticket`
    );
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["recommendedMovies"],
    queryFn: getRecommendedMovies,
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading movies...</p>;
  }

  if (isError) {
    return <p className="text-center py-10 text-red-500">Failed to load movies</p>;
  }

  // ✅ SAFELY HANDLE RESPONSE
  const movies =
    data?.data?.topMovies ||
    data?.data?.movies ||
    [];

  console.log("Recommended movies count:", movies.length);

  return (
    <div className="w-full py-6 bg-white">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            Recommended Movies
          </h2>

          <span
            onClick={() => navigate("/movies")}
            className="text-md text-red-500 cursor-pointer hover:underline font-medium"
          >
            See All
          </span>
        </div>

        {movies.length === 0 ? (
          <p className="text-center text-gray-500">
            No movies available
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {movies.map((movie) => (
              <div
                key={movie._id}
                onClick={() => handleNavigate(movie)}
                className="rounded overflow-hidden cursor-pointer hover:scale-105 transition"
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-full h-[300px] object-cover rounded"
                />

                <div className="bg-black text-white text-sm px-2 py-1 flex justify-between">
                  <span>⭐ {movie.rating}/10</span>
                  <span>{movie.votes} Votes</span>
                </div>

                <div className="px-2 py-1">
                  <h3 className="font-semibold text-lg">
                    {movie.title}
                  </h3>
                  <p className="text-md text-gray-500">
                    {movie.genre.join(" | ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommended;