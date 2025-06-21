import { Chat } from "../models/index.js";
import { generateChatTitle } from "../utils/helpers.js";

export const getChatHistory = async (page = 1, limit = 50) => {
  const skip = (page - 1) * limit;

  const chats = await Chat.find({ isActive: true })
    .sort({ lastActivity: -1 })
    .limit(limit)
    .skip(skip)
    .select("_id title lastActivity createdAt chats");

  const totalChats = await Chat.countDocuments({ isActive: true });

  return {
    chats,
    pagination: {
      page,
      limit,
      total: totalChats,
      pages: Math.ceil(totalChats / limit),
    },
  };
};

export const getChatById = async (chatId) => {
  return await Chat.findById(chatId);
};

export const createOrUpdateChat = async (chatId, userMessage) => {
  let chat = await Chat.findById(chatId);
  
  if (!chat) {
    chat = new Chat({
      _id: chatId,
      title: generateChatTitle(userMessage.content),
      chats: [userMessage],
      lastActivity: new Date(),
    });
  } else {
    chat.chats.push(userMessage);
    chat.lastActivity = new Date();
  }

  return await chat.save();
};

export const addMessageToChat = async (chatId, message) => {
  const chat = await Chat.findById(chatId);
  if (!chat) {
    throw new Error("Chat not found");
  }

  chat.chats.push(message);
  chat.lastActivity = new Date();
  
  return await chat.save();
};

export const deleteChat = async (chatId) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    { isActive: false },
    { new: true }
  );
};

export const clearAllChats = async () => {
  return await Chat.updateMany({}, { isActive: false });
};