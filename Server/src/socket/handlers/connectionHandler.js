import { handleMessage } from "./messageHandler.js";
import { handleNews } from "./newsHandler.js";

export const handleConnection = (socket, io) => {
  console.log("🔌 New client connected:", socket.id);

  // Send welcome message
  socket.emit("connected", {
    success: true,
    message: "Connected to EduGuide AI server",
    timestamp: new Date().toISOString(),
  });

  // Handle user messages
  socket.on("send", (data) => handleMessage(socket, data, io));

  // Handle news requests
  socket.on("news", (data) => handleNews(socket, data));

  // Handle disconnect
  socket.on("disconnect", (reason) => {
    console.log("🔌 Client disconnected:", socket.id, "Reason:", reason);
  });

  // Handle connection errors
  socket.on("error", (error) => {
    console.error("🚨 Socket error:", error);
  });
};