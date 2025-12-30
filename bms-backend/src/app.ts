import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import routes from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1", routes);

// Health check (keep BEFORE error handler)
app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});

// Global error handler (MUST be last)
app.use(globalErrorHandler);

export default app;
