import { Request, Response, NextFunction } from "express";
import * as BookingService from "./booking.service";
import mongoose from "mongoose";

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      user,
      movie,
      theater,
      showId,
      showDate,
      showTime,
      seats,
      amount,
    } = req.body;

    // ✅ STRICT VALIDATION
    if (
      !user?.name ||
      !user?.email ||
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

    // ✅ Convert seats to string format
    const formattedSeats: string[] = seats.map((seat: any) =>
      typeof seat === "string" ? seat : `${seat.row}${seat.number}`
    );

    // ✅ CONVERT IDS TO ObjectId
    const bookingPayload = {
      user: {
        name: user.name,
        email: user.email,
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
    console.error("BOOKING ERROR:", error.message);

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
  try {
    const { email } = req.params;

    const bookings = await BookingService.getBookingsByEmail(email);

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};
