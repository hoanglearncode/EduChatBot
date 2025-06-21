import express from "express";
import {
  getChatHistory,
  getChatById,
  deleteChat,
  clearAllChats,
} from "../controllers/chatController.js";

const router = express.Router();

// Get chat history
router.get("/history", getChatHistory);

// Get specific chat
router.get("/history/:chatId", getChatById);

// Delete specific chat
router.delete("/history/:chatId", deleteChat);

// Clear all chat history
router.delete("/history", clearAllChats);

export default router;