import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";

import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { env } from "./config/env.config.js";
import { Vote } from "./models/vote.model.js";

const server = http.createServer(app);

// 🔥 Socket.io setup
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      env.clientUrl, // use env config consistently
    ],
    credentials: true,
  },
});

// 🔁 Make io globally available
export { io };

// 🧠 Room-based logic
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join_poll", (pollId) => {
    socket.join(pollId);
    console.log(`📥 User joined poll room: ${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// 🚀 Start server
const startServer = async () => {
  try {
    await connectDB();

    // 🔥 Force sync indexes (ensures unique constraint exists)
    await Vote.syncIndexes();
    console.log("🔥 Vote indexes synced");

    server.listen(env.port, () => {
      console.log(`🚀 Server running on port ${env.port}`);
    });

  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
