import * as chatService from "../../services/chatService.js";
import * as aiService from "../../services/aiService.js";

export const handleMessage = async (socket, data, io) => {
  try {
    console.log("📩 Received message:", data);

    const { content, id, timestamp } = data;
    const chatId = id.toString();

    // Create user message
    const userMessage = {
      type: "user",
      content: content,
      timestamp: timestamp || new Date().toISOString(),
    };

    // Save user message to database
    await chatService.createOrUpdateChat(chatId, userMessage);

    // Get AI response
    const aiResponse = await aiService.processUserMessage(content);

    if (aiResponse.success) {
      // Create AI message
      const aiMessage = {
        type: "ai",
        content: aiResponse.data.content,
        timestamp: aiResponse.data.timestamp,
      };

      // Save AI response to database
      await chatService.addMessageToChat(chatId, aiMessage);

      // Send AI response back to client
      socket.emit("res", {
        success: true,
        data: aiResponse.data,
      });

      // Broadcast to other clients in the same room (optional)
      socket.broadcast.emit("new_message", {
        success: true,
        data: aiResponse.data,
        chatId: chatId,
      });

      console.log("✅ Message processed and saved successfully");
    } else {
      throw new Error(aiResponse.message || "Failed to process AI response");
    }
  } catch (error) {
    console.error("❌ Error processing message:", error);
    socket.emit("res", {
      success: false,
      message: "Failed to process message",
      error: error.message,
    });
  }
};