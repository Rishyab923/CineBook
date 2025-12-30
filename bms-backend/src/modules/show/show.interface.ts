import { Types } from "mongoose";
export interface IShow {
  _id?: string;
  movie: Types.ObjectId;
  theater: Types.ObjectId;
  location: string;
  format: "2D" | "3D" | "IMAX" | "PVR PXL";
  audioType?: string;
  startTime: string;
  date: string;

  priceMap: Record<"PREMIUM" | "EXECUTIVE" | "NORMAL", number>;

  seatLayout: {
    row: string;
    category: "PREMIUM" | "EXECUTIVE" | "NORMAL";
    seats: {
      number: number;
      status: "AVAILABLE" | "BOOKED" | "BLOCKED";
    }[];
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}
