import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import pollRoutes from "./routes/poll.routes.js";
import voteRoutes from "./routes/vote.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";

const app = express();

/**
 * Security Middleware
 * - helmet: Sets secure HTTP headers
 * - cors: Configures allowed origins and credentials
 */
app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
    credentials: true,
  })
);

/**
 * Request Parsing Middleware
 * - Parses incoming JSON payloads
 * - Parses cookies from request headers
 */
app.use(express.json());
app.use(cookieParser());

/**
 * Health check endpoint.
 * Confirms backend service is operational.
 */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Live Poll Backend is running",
  });
});

/**
 * Application Routes
 */
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

/**
 * 404 Handler
 * Handles requests to undefined routes.
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 * Centralized error response management.
 */
app.use(errorHandler);

export default app;
