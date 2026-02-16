import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { env } from "./config/env.config.js";
import { Vote } from "./models/vote.model.js";

/**
 * Create HTTP server using Express application instance.
 */
const server = http.createServer(app);

/**
 * Initialize Socket.IO server with CORS configuration.
 * Allows connections from local development and configured client URL.
 */
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      env.clientUrl,
    ],
    credentials: true,
  },
});

/**
 * Export Socket.IO instance for use in other modules
 * (e.g., emitting vote updates from controllers).
 */
export { io };

/**
 * Socket.IO connection lifecycle.
 * Handles:
 * - Client connection
 * - Poll room subscription
 * - Disconnection cleanup
 */
io.on("connection", (socket) => {
  /**
   * Subscribe client to a specific poll room
   * to receive real-time vote updates.
   */
  socket.on("join_poll", (pollId) => {
    socket.join(pollId);
  });

  /**
   * Handle socket disconnection.
   * Reserved for future cleanup or logging if required.
   */
  socket.on("disconnect", () => {
    // No-op
  });
});

/**
 * Bootstraps the application:
 * - Connects to database
 * - Ensures required indexes exist
 * - Starts HTTP server
 */
const startServer = async () => {
  try {
    await connectDB();

    /**
     * Synchronize MongoDB indexes.
     * Ensures unique constraints are applied (e.g., vote uniqueness).
     */
    await Vote.syncIndexes();

    server.listen(env.port);
  } catch (error) {
    process.exit(1);
  }
};

startServer();
