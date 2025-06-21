import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// MongoDB Models (same as in App.js)
const messageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    content: {
      type: String,
      required: true,
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
  },
  { timestamps: true },
);

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
  { timestamps: true },
);

const Chat = mongoose.model("Chat", chatSchema);

// Sample data
const sampleChats = [
  {
    _id: "demo-chat-1",
    title: "Hướng dẫn học lập trình",
    chats: [
      {
        type: "user",
        content: "Tôi muốn học lập trình từ đầu, bạn có thể hướng dẫn không?",
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
      },
      {
        type: "ai",
        content:
          "Tất nhiên! Để bắt đầu học lập trình, tôi khuyên bạn nên:\n\n1. **Chọn ngôn ngữ phù hợp**: Python là lựa chọn tốt cho người mới bắt đầu\n2. **Học cơ bản**: Biến, vòng lặp, điều kiện\n3. **Thực hành thường xuyên**: Làm bài tập mỗi ngày\n4. **Tham gia cộng đồng**: Tham gia các forum, group học tập\n\nBạn có muốn tôi đề xuất lộ trình học cụ thể không?",
        timestamp: new Date(Date.now() - 86400000 + 60000),
      },
    ],
    lastActivity: new Date(Date.now() - 86400000 + 60000),
    isActive: true,
  },
  {
    _id: "demo-chat-2",
    title: "Lựa chọn ngành nghề",
    chats: [
      {
        type: "user",
        content:
          "Tôi đang phân vân giữa ngành CNTT và Kinh tế. Bạn có thể tư vấn không?",
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      },
      {
        type: "ai",
        content:
          "Đây là quyết định quan trọng! Hãy cùng phân tích:\n\n**Công nghệ thông tin:**\n- Triển vọng việc làm cao\n- Mức lương cạnh tranh\n- Yêu cầu tư duy logic, giải quyết vấn đề\n- Cần cập nhật kiến thức liên tục\n\n**Kinh tế:**\n- Phạm vi ứng dụng rộng\n- Cơ hội trong nhiều lĩnh vực\n- Yêu cầu kỹ năng phân tích, giao tiếp\n- Ổn định nhưng cạnh tranh cao\n\nBạn có thể chia sẻ thêm về sở thích và thế mạnh của mình không?",
        timestamp: new Date(Date.now() - 3600000 + 120000),
      },
    ],
    lastActivity: new Date(Date.now() - 3600000 + 120000),
    isActive: true,
  },
  {
    _id: "demo-chat-3",
    title: "Kỹ năng học tập hiệu quả",
    chats: [
      {
        type: "user",
        content: "Làm thế nào để học hiệu quả hơn?",
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      },
      {
        type: "ai",
        content:
          "Đây là những phương pháp học tập hiệu quả:\n\n🎯 **Kỹ thuật Pomodoro**: Học 25 phút, nghỉ 5 phút\n📝 **Ghi chú có hệ thống**: Sử dụng mind map, cornell notes\n🔄 **Ôn tập định kỳ**: Áp dụng đường cong quên lãng\n👥 **Học nhóm**: Thảo luận và giải thích cho người khác\n🎯 **Đặt mục tiêu cụ thể**: SMART goals\n\nBạn đang gặp khó khăn ở khía cạnh nào cụ thể?",
        timestamp: new Date(Date.now() - 1800000 + 90000),
      },
    ],
    lastActivity: new Date(Date.now() - 1800000 + 90000),
    isActive: true,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/chatbot",
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Chat.deleteMany({});
    console.log("🗑️ Cleared existing chat data");

    // Insert sample data
    await Chat.insertMany(sampleChats);
    console.log("✅ Sample data inserted successfully");

    // Display summary
    const totalChats = await Chat.countDocuments();
    console.log(`📊 Total chats in database: ${totalChats}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
