import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.config.js";
import { env } from "./config/env.config.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],
    credentials: true,
  },
});


// Room-based logic
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join_poll", (pollId) => {
    socket.join(pollId);
    console.log(`User joined poll room: ${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export io globally
export { io };

const startServer = async () => {
  await connectDB();
  await Vote.syncIndexes();
  console.log("🔥 Vote indexes synced");
  server.listen(env.port, () => {
    console.log(`🚀 Server running on port ${env.port}`);
  });
};

startServer();
