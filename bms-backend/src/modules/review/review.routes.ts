import { Router } from "express";
import * as ReviewController from "./review.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/movie/:movieId", ReviewController.getReviewsByMovie);
router.post("/", auth, ReviewController.addReview);

export default router;
