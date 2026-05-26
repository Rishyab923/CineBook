import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import routes from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

// ✅ CORS MUST BE FIRST
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost",
  "http://localhost:80",
  process.env.FRONTEND_URL,       // Dynamically allow EC2 IP or any domain
].filter(Boolean) as string[];

// Dynamic CORS configuration function to handle same-origin, EC2, and local scenarios
app.use(
  cors((req, callback) => {
    const origin = req.header("Origin");
    const host = req.header("Host");
    const forwardedHost = req.header("X-Forwarded-Host");

    let isAllowed = false;

    if (!origin) {
      // Allow requests with no origin (Postman, same-origin server requests)
      isAllowed = true;
    } else {
      try {
        const url = new URL(origin);

        // 1. Allow explicitly listed origins
        if (allowedOrigins.includes(origin)) {
          isAllowed = true;
        }
        // 2. Allow same-origin requests served via local host or reverse proxy
        else if (host && url.host === host) {
          isAllowed = true;
        }
        // 3. Allow same-origin requests served via forwarded proxy host (e.g. Nginx on EC2)
        else if (forwardedHost && url.host === forwardedHost) {
          isAllowed = true;
        }
        // 4. Allow AWS EC2 public DNS/Amazon domains
        else if (url.hostname.endsWith(".amazonaws.com")) {
          isAllowed = true;
        }
        // 5. Allow Render deployments
        else if (url.hostname.endsWith(".onrender.com")) {
          isAllowed = true;
        }
        // 6. Accept any IP-based HTTP origin (handles direct EC2 IP access)
        else if (/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) {
          isAllowed = true;
        }
      } catch (_) {
        // ignore URL parse errors
      }
    }

    if (isAllowed) {
      callback(null, {
        origin: true, // Reflect the request origin back to the client
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
      });
    } else {
      console.log("CORS Rejected:", origin, "| Allowed:", allowedOrigins);
      callback(new Error("Not allowed by CORS"));
    }
  })
);

// ✅ Handle ALL preflight requests with same CORS config across-the-board
app.options("*any", cors());

app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/v1", routes);

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});

// Global error handler (LAST)
app.use(globalErrorHandler);

export default app;
