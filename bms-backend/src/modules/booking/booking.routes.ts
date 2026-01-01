import { Router } from "express";
import { createBooking, getUserBookings } from "./booking.controller";
import { auth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", auth, createBooking);
router.get("/me", auth, getUserBookings);

export default router;
