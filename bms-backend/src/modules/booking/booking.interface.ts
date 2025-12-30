import { Types } from "mongoose";

export interface IBooking {
  user: {
    name: string;
    email: string;
  };

  movie: Types.ObjectId;     // reference
  theater: Types.ObjectId;   // reference
  showId: Types.ObjectId;    // ✅ REQUIRED

  showDate: string;
  showTime: string;

  seats: string[]; // ["E2", "E4"]
  amount: number;

  createdAt?: Date;
}
