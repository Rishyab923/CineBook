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
    origin: (origin, callback) => {
      // allow server-to-server or tools like curl/postman
      if (!origin) return callback(null, true);

      // allow localhost (dev)
      if (origin === "http://localhost:5173") {
        return callback(null, true);
      }

      // allow ALL Render frontends
      if (origin.endsWith(".onrender.com")) {
        return callback(null, true);
      }

      // otherwise block
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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
