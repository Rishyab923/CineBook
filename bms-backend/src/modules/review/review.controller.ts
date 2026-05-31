import { Request, Response, NextFunction, RequestHandler } from "express";
import * as ReviewService from "./review.service";

export const addReview: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is set by auth middleware
    const userId = (req as any).user.id;
    const { movieId, rating, comment } = req.body;

    if (!movieId || !rating || !comment) {
      res.status(400).json({ message: "movieId, rating, and comment are required." });
      return;
    }

    const review = await ReviewService.addReview(userId, movieId, rating, comment);
    res.status(201).json({ message: "Review added successfully", review });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: "You have already reviewed this movie." });
      return;
    }
    next(error);
  }
};

export const getReviewsByMovie: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { movieId } = req.params;
    const reviews = await ReviewService.getReviewsByMovie(movieId);
    res.status(200).json({ reviews });
  } catch (error) {
    next(error);
  }
};
