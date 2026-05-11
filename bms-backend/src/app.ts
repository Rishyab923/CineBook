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

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, same-origin via proxy)
    if (!origin) return callback(null, true);

    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Allow Render deployments
    if (origin.endsWith(".onrender.com")) return callback(null, true);

    // Allow any HTTP origin on the same host (handles reverse proxy / EC2 IP scenarios)
    // This is safe because the backend is not publicly exposed — only nginx port 80 is
    try {
      const url = new URL(origin);
      // Check against FRONTEND_URL hostname
      if (process.env.FRONTEND_URL) {
        const frontendUrl = new URL(process.env.FRONTEND_URL);
        if (url.hostname === frontendUrl.hostname) {
          return callback(null, true);
        }
      }
      // Also accept any IP-based HTTP origin (for EC2 deployments where FRONTEND_URL may be unset)
      if (/^\d+\.\d+\.\d+\.\d+$/.test(url.hostname)) {
        return callback(null, true);
      }
    } catch (_) {
      // ignore URL parse errors
    }

    console.log("CORS Rejected:", origin, "| Allowed:", allowedOrigins);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Handle ALL preflight requests with same CORS config
app.options("{*path}", cors(corsOptions));

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
