import mongoose from "mongoose";

export const connectDatabase = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/chatbot";
    
    await mongoose.connect(MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ Connected to MongoDB successfully");
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error("❌ MongoDB connection error:", error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log("🔌 MongoDB disconnected");
    });
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
    });
    
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export const getConnectionStatus = () => {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
};