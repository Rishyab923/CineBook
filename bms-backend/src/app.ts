import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Request, Response } from "express";
import router from "./routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import routes from "./routes";

dotenv.config();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(cookieParser());
app.use(express.json());

// All Routes
app.use("/api/v1/", router);

app.use("/api", routes);

// Global error handler (MUST be after all routes)
app.use(globalErrorHandler);

app.get("/", (_req: Request, res: Response) => {
  res.send("API is running");
});
});

export default app;
