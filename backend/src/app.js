import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import pollRoutes from "./routes/poll.routes.js";
import voteRoutes from "./routes/vote.routes.js";

import { errorHandler } from "./middlewares/error.middleware.js";
import { notFoundHandler } from "./middlewares/notFound.middleware.js";
import { env } from "./config/env.config.js";

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));

// Body parsing
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
