import { Types } from "mongoose";

export interface IBooking {
  user: {
    userId: Types.ObjectId;
    email: string;
    username: string; // ✅ STORE USER NAME
  };

  movie: Types.ObjectId;
  theater: Types.ObjectId;
  showId: Types.ObjectId;

  showDate: string;
  showTime: string;

  seats: string[];
  amount: number;

  createdAt?: Date;
}
