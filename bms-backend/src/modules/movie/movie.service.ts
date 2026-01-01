import { IMovie } from "./movie.interface";
import { MovieModel } from "./movie.model";

// 1. Create a movie
export const createMovie = async (movie: IMovie) => {
  return await MovieModel.create(movie);
};

// 2. Get all movies (no limit, sorted by release date descending)
export const getAllMovies = async () => {
  return await MovieModel.find().sort({ releaseDate: -1 });
};

// 3. Get movie by ID
export const getMovieById = async (id: string) => {
  return await MovieModel.findById(id);
};

// 4. Get top movies by votes (optional limit)
export const getTopMovieByVotes = async (limit: number) => {
  return await MovieModel.find()
    .sort({ votes: -1 })
    .limit(limit);
};