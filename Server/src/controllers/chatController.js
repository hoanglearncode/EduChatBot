import * as chatService from "../services/chatService.js";

export const getChatHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const page = parseInt(req.query.page) || 1;

    const result = await chatService.getChatHistory(page, limit);
    
    res.json({
      success: true,
      data: result.chats,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: error.message,
    });
  }
};

export const getChatById = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await chatService.getChatById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.error("❌ Error fetching chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat",
      error: error.message,
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await chatService.deleteChat(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.json({
      success: true,
      message: "Chat deleted successfully",
      data: chat,
    });
  } catch (error) {
    console.error("❌ Error deleting chat:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete chat",
      error: error.message,
    });
  }
};

export const clearAllChats = async (req, res) => {
  try {
    await chatService.clearAllChats();

    res.json({
      success: true,
      message: "All chat history cleared successfully",
    });
  } catch (error) {
    console.error("❌ Error clearing chat history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to clear chat history",
      error: error.message,
    });
  }
};