import { Types } from "mongoose";
import { IMovie } from "../modules/movie/movie.interface";
import { IShow } from "../modules/show/show.interface";
import { ITheater } from "../modules/theater/theater.interface";

/* =========================================================
   TYPES
========================================================= */

type GroupedShow = {
  movie: Types.ObjectId | IMovie;
  theater: {
    theaterDetails: Types.ObjectId | ITheater;
    shows: Array<{
      _id: string;
      date: string;
      startTime: string;
      format: string;
      audioType: string;
    }>;
  };
};

/* =========================================================
   VALIDATIONS
========================================================= */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/* =========================================================
   EXPORTS
========================================================= */

export { generateSeatLayout } from "./generateSeatLayout";

/* =========================================================
   GROUP SHOWS BY THEATER & MOVIE
========================================================= */

export const groupShowsByTheaterAndMovie = (
  shows: IShow[]
): GroupedShow[] => {
  const grouped: Record<string, GroupedShow> = {};

  shows.forEach((show) => {
    const movieId =
      typeof show.movie === "object" ? show.movie._id : show.movie;

    const theaterId =
      typeof show.theater === "object" ? show.theater._id : show.theater;

    const key = `${movieId}_${theaterId}`;

    if (!grouped[key]) {
      grouped[key] = {
        movie: show.movie,
        theater: {
          theaterDetails: show.theater,
          shows: [],
        },
      };
    }

    grouped[key].theater.shows.push({
      _id: show._id?.toString() || "",
      date: show.date || "",
      startTime: show.startTime || "",
      format: show.format || "",
      audioType: show.audioType || "",
    });
  });

  return Object.values(grouped);
};
