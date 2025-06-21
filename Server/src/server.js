import { createServer } from "http";
import dotenv from "dotenv";
import app from "./App.js";
import { connectDatabase } from "./config/database.js";
import { initializeSocket } from "./socket/index.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8080;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📡 Socket.IO server is ready`);
      console.log(`🌐 CORS enabled for development`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown handlers
const gracefulShutdown = (signal) => {
  console.log(`🛑 ${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Start the server
startServer();