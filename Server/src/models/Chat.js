import mongoose from "mongoose";
import { messageSchema } from "./Message.js";

const chatSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "New Chat",
    },
    chats: [messageSchema],
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for message count
chatSchema.virtual('messageCount').get(function() {
  return this.chats.length;
});

// Index for better query performance
chatSchema.index({ lastActivity: -1 });
chatSchema.index({ isActive: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;