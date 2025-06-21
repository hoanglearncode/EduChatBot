# EduGuide AI Backend

Một ứng dụng backend cho chatbot AI giáo dục với Socket.IO và MongoDB.

## 🚀 Tính năng

- ✅ RESTful API với Express.js
- ✅ Real-time communication với Socket.IO
- ✅ MongoDB integration với Mongoose
- ✅ Cấu trúc thư mục modular và scalable
- ✅ Error handling và logging
- ✅ CORS configuration
- ✅ Environment configuration
- ✅ Graceful shutdown

## 📁 Cấu trúc thư mục

```
src/
├── app.js              # Main application
├── server.js          # Server entry point
├── config/            # Configuration files
├── models/            # MongoDB models
├── controllers/       # Route controllers
├── services/          # Business logic
├── routes/            # API routes
├── socket/            # Socket.IO handlers
├── middleware/        # Custom middleware
└── utils/             # Utility functions
```

## 🛠 Cài đặt

1. Clone repository:
```bash
git clone <your-repo-url>
cd eduguide-ai-backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file environment:
```bash
cp .env.example .env
```

4. Cấu hình MongoDB URL trong file `.env`:
```env
MONGODB_URL=mongodb://localhost:27017/chatbot
PORT=8080
```

5. Khởi chạy server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📚 API Endpoints

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

### Chat Management
- `GET /history` - Lấy lịch sử chat
- `GET /history/:chatId` - Lấy chat cụ thể
- `DELETE /history/:chatId` - Xóa chat
- `DELETE /history` - Xóa tất cả chat

## 🔌 Socket.IO Events

### Client → Server
- `send` - Gửi tin nhắn từ user
- `news` - Yêu cầu tin tức

### Server → Client
- `connected` - Xác nhận kết nối
- `res` - Phản hồi từ AI
- `res_res` - Phản hồi tin tức
- `new_message` - Broadcast tin nhắn mới

## 🗄 Database Schema

### Chat Model
```javascript
{
  _id: String,          // Chat ID
  title: String,        // Chat title
  chats: [Message],     // Array of messages
  lastActivity: Date,   // Last activity timestamp
  isActive: Boolean     // Soft delete flag
}
```

### Message Schema
```javascript
{
  type: String,         // "user" | "ai"
  content: String,      // Message content
  timestamp: Date,      // Message timestamp
  isError: Boolean,     // Error flag
  isNews: Boolean       // News flag
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Development

```bash
# Linting
npm run lint
npm run lint:fix

# Development mode với auto-reload
npm run dev
```

## 🚀 Deployment

1. Set environment variables:
```env
NODE_ENV=production
MONGODB_URL=your-production-mongodb-url
PORT=80
```

2. Build và chạy:
```bash
npm start
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `8080` |
| `NODE_ENV` | Environment | `development` |
| `MONGODB_URL` | MongoDB connection string | `mongodb://localhost:27017/chatbot` |

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

Nếu bạn gặp vấn đề gì, hãy tạo issue trên GitHub repository.