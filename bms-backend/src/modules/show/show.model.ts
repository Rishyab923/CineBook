import mongoose, { Schema } from "mongoose";
import { IShow } from "./show.interface";

const seatSchema = new Schema(
  {
    number: Number,
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "BLOCKED"],
      default: "AVAILABLE",
    },
  },
  { _id: false }
);

const seatRowSchema = new Schema(
  {
    row: String,
    category: {
      type: String,
      enum: ["PREMIUM", "EXECUTIVE", "NORMAL"],
      required: true,
    },
    seats: [seatSchema],
  },
  { _id: false }
);

const showSchema = new Schema<IShow>({
  movie: { type: Schema.Types.ObjectId, ref: "Movie", required: true },
  theater: { type: Schema.Types.ObjectId, ref: "Theater", required: true },
  location: String,
  format: String,
  audioType: String,
  startTime: String,
  date: String,
  priceMap: { type: Map, of: Number },
  seatLayout: [seatRowSchema],
});

export const ShowModel = mongoose.model<IShow>("Show", showSchema);