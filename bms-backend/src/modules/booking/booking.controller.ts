import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import * as BookingService from "./booking.service";

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export const createBooking = async (
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> => {
  try {
    const authReq = req as RequestWithUser;

    if (!authReq.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      movie,
      theater,
      showId,
      showDate,
      showTime,
      seats,
      amount,
    } = req.body;

    if (
      !movie ||
      !theater ||
      !showId ||
      !showDate ||
      !showTime ||
      !seats?.length ||
      !amount
    ) {
      res.status(400).json({
        success: false,
        message: "Missing required booking details",
      });
      return;
    }

    const formattedSeats: string[] = seats.map((seat: any) =>
      typeof seat === "string" ? seat : `${seat.row}${seat.number}`
    );

    const bookingPayload = {
      user: {
        userId: new mongoose.Types.ObjectId(authReq.user.id),
        email: authReq.user.email,
        username: authReq.user.username, // ✅ FROM JWT
      },

      movie: new mongoose.Types.ObjectId(movie),
      theater: new mongoose.Types.ObjectId(theater),
      showId: new mongoose.Types.ObjectId(showId),

      showDate,
      showTime,
      seats: formattedSeats,
      amount,
    };

    const booking = await BookingService.createBooking(bookingPayload);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Booking failed",
    });
  }
};

export const getUserBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const authReq = req as RequestWithUser;

  if (!authReq.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const bookings = await BookingService.getBookingsByUserId(authReq.user.id);

  res.status(200).json({
    success: true,
    data: bookings,
  });
};
