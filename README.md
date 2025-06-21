# 🎓 EduGuide AI - Hệ thống Chatbot Giáo dục Thông minh

Một nền tảng chatbot AI hoàn chỉnh được thiết kế đặc biệt để hỗ trợ định hướng học tập và giáo dục, bao gồm cả Frontend React và Backend Node.js với kết nối real-time.

![Status](https://img.shields.io/badge/Status-Active-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## 🌟 Tổng quan dự án

EduGuide AI là một hệ thống chatbot giáo dục đầy đủ tính năng, kết hợp giữa giao diện người dùng hiện đại (React) và backend mạnh mẽ (Node.js + MongoDB) để tạo ra trải nghiệm học tập tương tác và thông minh.

### 🎯 Mục tiêu
- Hỗ trợ học sinh, sinh viên trong việc định hướng học tập
- Cung cấp thông tin giáo dục chính xác và kịp thời
- Tạo trải nghiệm trò chuyện tự nhiên và thân thiện
- Quản lý lịch sử học tập và theo dõi tiến độ

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│                     │    │                     │    │                     │
│   Frontend (React)  │◄──►│  Backend (Node.js)  │◄──►│   Database (MongoDB)│
│                     │    │                     │    │                     │
│ • React 18+         │    │ • Express.js        │    │ • Chat History      │
│ • Socket.IO Client  │    │ • Socket.IO Server  │    │ • User Sessions     │
│ • Modern UI/UX      │    │ • RESTful API       │    │ • Analytics Data    │
│ • Real-time Chat    │    │ • Real-time Events  │    │                     │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

## ✨ Tính năng chính

### 🎨 Frontend Features
- **Giao diện hiện đại**: Thiết kế responsive với gradient backgrounds
- **Chat real-time**: Kết nối Socket.IO với typing indicators
- **Quản lý lịch sử**: Sidebar với danh sách các cuộc trò chuyện
- **Tính năng tin tức**: Cập nhật tin tức giáo dục mới nhất
- **Trải nghiệm mượt mà**: Animation và transition effects
- **Multi-device support**: Hoạt động tốt trên desktop, tablet, mobile

### ⚙️ Backend Features
- **RESTful API**: Express.js với cấu trúc modular
- **Real-time Communication**: Socket.IO server
- **Database Integration**: MongoDB với Mongoose
- **Error Handling**: Comprehensive error management
- **Scalable Architecture**: Organized folder structure
- **Environment Configuration**: Flexible deployment options

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18+ | UI Framework |
| Socket.IO Client | 4.0+ | Real-time Communication |
| Axios | 1.0+ | HTTP Client |
| Lucide React | 0.200+ | Icons |
| CSS3 | - | Styling & Animations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 16+ | Runtime Environment |
| Express.js | 4.0+ | Web Framework |
| Socket.IO | 4.0+ | Real-time Server |
| MongoDB | 5.0+ | Database |
| Mongoose | 6.0+ | ODM |

## 🚀 Quick Start

### Yêu cầu hệ thống
- Node.js 16+
- MongoDB 5.0+
- npm hoặc yarn
- Git

### Cài đặt đầy đủ

1. **Clone dự án:**
```bash
git clone https://github.com/yourusername/eduguide-ai.git
cd eduguide-ai
```

2. **Cài đặt Backend:**
```bash
# Di chuyển vào thư mục backend
cd backend
npm install

# Tạo file environment
cp .env.example .env

# Cấu hình MongoDB
# Chỉnh sửa file .env với thông tin database của bạn
```

3. **Cài đặt Frontend:**
```bash
# Di chuyển vào thư mục frontend
cd ../frontend
npm install
```

4. **Khởi chạy hệ thống:**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

5. **Truy cập ứng dụng:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

## 📁 Cấu trúc dự án

```
eduguide-ai/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/       # React Components
│   │   │   ├── SliderBar/   # Sidebar Components
│   │   │   └── common/       # Shared Components
│   │   ├── assets/          # CSS và media files
│   │   ├── AIChatbot.js     # Main Chat Component
│   │   └── index.js         # Entry Point
│   ├── public/              # Static Files
│   └── package.json         # Dependencies
│
├── backend/                  # Node.js Server
│   ├── src/
│   │   ├── config/          # Configuration Files
│   │   ├── models/          # MongoDB Models
│   │   ├── controllers/     # Route Controllers
│   │   ├── services/        # Business Logic
│   │   ├── routes/          # API Routes
│   │   ├── socket/          # Socket.IO Handlers
│   │   ├── middleware/      # Custom Middleware
│   │   └── utils/           # Utility Functions
│   ├── app.js              # Express Application
│   ├── server.js           # Server Entry Point
│   └── package.json        # Dependencies
│
├── docs/                    # Documentation
├── .gitignore              # Git Ignore Rules
├── README.md               # This File
└── LICENSE                 # License Information
```

## 🔌 API Documentation

### REST Endpoints

#### Health & Status
```
GET /api/health              # Kiểm tra trạng thái server
```

#### Chat Management
```
GET /history                 # Lấy lịch sử chat (limit=50)
GET /history/:chatId         # Lấy chi tiết một cuộc chat
DELETE /history/:chatId      # Xóa một cuộc chat
DELETE /history             # Xóa tất cả lịch sử chat
```

### Socket.IO Events

#### Client → Server
```javascript
// Gửi tin nhắn chat
socket.emit('send', {
  content: "Tin nhắn của user",
  id: "chat_id", 
  timestamp: "2025-06-22T10:00:00Z"
});

// Yêu cầu tin tức
socket.emit('news', {
  timestamp: "2025-06-22T10:00:00Z"
});
```

#### Server → Client
```javascript
// Phản hồi tin nhắn
socket.on('res', (response) => {
  // response.success: boolean
  // response.data: message content
});

// Phản hồi tin tức
socket.on('res_res', (response) => {
  // response.success: boolean
  // response.data: news content
});

// Tin nhắn mới từ client khác
socket.on('new_message', (message) => {
  // Broadcast message
});
```

## 🗄️ Database Schema

### Chat Collection
```javascript
{
  _id: ObjectId,              // Chat unique ID
  title: String,              // Chat title/topic
  chats: [MessageSchema],     // Array of messages
  lastActivity: Date,         // Last interaction time
  isActive: Boolean,          // Soft delete flag
  createdAt: Date,           // Creation timestamp
  updatedAt: Date            // Last update timestamp
}
```

### Message Schema
```javascript
{
  type: String,              // "user" | "ai"
  content: String,           // Message content
  timestamp: Date,           // Message time
  id: Number,               // Message ID
  isError: Boolean,         // Error message flag
  isNews: Boolean           // News message flag
}
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Server Configuration
NODE_ENV=development
PORT=8080

# Database
MONGODB_URL=mongodb://localhost:27017/chatbot

# Socket.IO
SOCKET_CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

#### Frontend (Optional .env)
```env
# API Configuration
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_SOCKET_URL=http://localhost:8080
```

### Tuning Performance

#### Backend Optimizations
```javascript
// Socket.IO Configuration
const io = new Server(server, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN,
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'],
  upgradeTimeout: 30000,
  pingTimeout: 60000
});
```

#### Frontend Optimizations  
```javascript
// Socket Client Configuration
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  upgrade: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000
});
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm test                   # Run React tests
npm run test:coverage      # Coverage report
```

### Integration Testing
```bash
# Chạy test end-to-end
npm run test:e2e
```

## 🚀 Deployment

### Development
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm start
```

### Production Build

#### Backend Deployment
```bash
cd backend
npm install --production
npm start
```

#### Frontend Build
```bash
cd frontend
npm run build
# Deploy build folder to static hosting
```

### Docker Deployment
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - MONGODB_URL=mongodb://mongo:27017/chatbot
    depends_on:
      - mongo
      
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
      
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Cloud Deployment Options

#### Frontend
- **Netlify**: Connect GitHub repo
- **Vercel**: Zero-config deployment  
- **Firebase Hosting**: `npm run build && firebase deploy`

#### Backend  
- **Heroku**: Push to Heroku Git
- **Railway**: Connect GitHub
- **DigitalOcean App Platform**: Dockerfile deployment

## 🔐 Security Considerations

### Backend Security
- CORS configuration
- Input validation và sanitization
- Rate limiting
- Environment variables protection
- MongoDB injection prevention

### Frontend Security
- XSS protection
- Secure Socket.IO connections
- Input validation
- No sensitive data in localStorage

## 🐛 Troubleshooting

### Common Issues

#### Connection Problems
```bash
# Check backend server
curl http://localhost:8080/api/health

# Check MongoDB connection
mongosh mongodb://localhost:27017/chatbot
```

#### Frontend Issues
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Socket connection
console.log('Socket connected:', socket.connected)
```

#### Database Issues
```bash
# Reset database
mongo chatbot --eval "db.dropDatabase()"

# Check collections
mongo chatbot --eval "show collections"
```

## 📊 Monitoring & Analytics

### Health Monitoring
- Server uptime tracking
- Database connection status
- Socket.IO connection metrics
- API response times

### User Analytics
- Chat session duration
- Popular topics/questions
- User engagement metrics
- Error rate tracking

## 🤝 Contributing

Chúng tôi rất hoan nghênh mọi đóng góp cho dự án!

### Development Workflow
1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Thực hiện changes và test
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Tạo Pull Request

### Code Standards
- ESLint configuration
- Prettier formatting
- Conventional commits
- Unit test coverage > 80%

## 📚 Documentation

### Additional Resources
- [Frontend Component Documentation](./docs/frontend.md)
- [Backend API Reference](./docs/backend.md)
- [Socket.IO Events Guide](./docs/socketio.md)
- [Database Schema Reference](./docs/database.md)
- [Deployment Guide](./docs/deployment.md)

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic chat functionality
- ✅ Real-time communication
- ✅ Chat history management
- ✅ News integration

### Phase 2 (Planned)
- 🔄 User authentication
- 🔄 Advanced AI features
- 🔄 File upload support
- 🔄 Voice messages

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Advanced analytics
- 📋 Mobile app
- 📋 AI model training

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs](https://github.com/yourusername/eduguide-ai/issues)
- **Discussions**: [Community forum](https://github.com/yourusername/eduguide-ai/discussions)
- **Email**: support@eduguide-ai.com
- **Documentation**: [Wiki](https://github.com/yourusername/eduguide-ai/wiki)

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) - AI technology inspiration
- [React Team](https://reactjs.org/) - Amazing frontend framework
- [Socket.IO Team](https://socket.io/) - Real-time communication
- [MongoDB](https://www.mongodb.com/) - Database solution
- [Express.js](https://expressjs.com/) - Web framework
- [Lucide](https://lucide.dev/) - Beautiful icons

---
