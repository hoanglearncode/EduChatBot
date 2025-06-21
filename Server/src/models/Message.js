import mongoose from "mongoose";

export const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isError: {
      type: Boolean,
      default: false,
    },
    isNews: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { 
    timestamps: true,
    _id: true
  }
);

// Index for better performance
messageSchema.index({ timestamp: -1 });
messageSchema.index({ type: 1 });

export default messageSchema;