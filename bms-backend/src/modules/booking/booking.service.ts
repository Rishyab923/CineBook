import mongoose from "mongoose";
import Booking from "./booking.model";
import { IBooking } from "./booking.interface";
import { ShowModel } from "../show/show.model";

export const createBooking = async (data: IBooking) => {
  const { showId, seats } = data;

  const show = await ShowModel.findById(showId);
  if (!show) {
    throw new Error("Show not found");
  }

  // 🔐 Check already booked seats
  const alreadyBooked: string[] = [];

  show.seatLayout.forEach((row) => {
    row.seats.forEach((seat) => {
      const seatId = `${row.row}${seat.number}`;
      if (seats.includes(seatId) && seat.status === "BOOKED") {
        alreadyBooked.push(seatId);
      }
    });
  });

  if (alreadyBooked.length > 0) {
    throw new Error(
      `Seats already booked: ${alreadyBooked.join(", ")}`
    );
  }

  // ✅ Lock seats
  show.seatLayout.forEach((row) => {
    row.seats.forEach((seat) => {
      const seatId = `${row.row}${seat.number}`;
      if (seats.includes(seatId)) {
        seat.status = "BOOKED";
      }
    });
  });

  await show.save();

  const booking = await Booking.create(data);
  return booking;
};

export const getBookingsByUserId = async (userId: string) => {
  return Booking.find({
    "user.userId": new mongoose.Types.ObjectId(userId),
  })
    .populate("movie", "title")
    .populate("theater", "name")
    .sort({ createdAt: -1 });
};