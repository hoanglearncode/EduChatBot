// ================================
// 5. config/socket.js - Cấu hình Socket.IO
// ================================
import { ChatService } from "../services/chat.service.js";

export function configureSocket(io, db) {
  const chatService = new ChatService(db);

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Xử lý tin nhắn từ client
    socket.on("send", async (data) => {
      console.log(`Received message from ${socket.id}:`, data);
      try {
        const response = await chatService.processMessage(
          data.content,
          data.id,
        );
        socket.emit("res", response);
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("error", { message: "Có lỗi xảy ra khi xử lý tin nhắn" });
      }
    });

    socket.on("news", async (data) => {
      try {
        const response = await chatService.processNewsChat();
        socket.emit("res_res", response);
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("error", { message: "Có lỗi xảy ra khi xử lý tin nhắn" });
      }
    });

    // Xử lý ngắt kết nối
    socket.on("disconnect", (reason) => {
      console.log(`❌ Client disconnect: ${socket.id} - ${reason}`);
    });
  });
}
