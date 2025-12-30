import mongoose, { Schema } from "mongoose";
import { IBooking } from "./booking.interface";

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },

    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },

    theater: {
      type: Schema.Types.ObjectId,
      ref: "Theater",
      required: true,
    },

    showId: {
      type: Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },

    showDate: { type: String, required: true },
    showTime: { type: String, required: true },

    seats: {
      type: [String],
      required: true,
    },

    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", bookingSchema);
