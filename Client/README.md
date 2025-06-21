# EduGuide AI Chatbot

Một ứng dụng chatbot AI thông minh được xây dựng bằng React và Socket.IO, được thiết kế đặc biệt để hỗ trợ định hướng học tập và giáo dục.

## ✨ Tính năng chính

### 🤖 Trò chuyện AI thông minh
- Giao diện chat hiện đại, thân thiện với người dùng
- Hỗ trợ trả lời câu hỏi về học tập và định hướng giáo dục
- Hiển thị trạng thái typing khi AI đang suy nghĩ
- Hỗ trợ tin nhắn dài với khả năng cuộn mượt mà

### 🔄 Kết nối Real-time
- Sử dụng Socket.IO để kết nối real-time với server
- Tự động reconnect khi mất kết nối
- Hiển thị trạng thái kết nối trực quan
- Đồng bộ tin nhắn giữa các client

### 📝 Quản lý lịch sử chat
- Lưu trữ và hiển thị lịch sử các cuộc trò chuyện
- Tạo cuộc trò chuyện mới
- Xóa lịch sử chat không cần thiết
- Sidebar để dễ dàng điều hướng giữa các cuộc chat

### 📰 Tính năng tin tức
- Yêu cầu tin tức mới nhất từ AI
- Hiển thị tin tức với định dạng đặc biệt
- Cập nhật tin tức real-time

### 🎨 Giao diện người dùng
- Thiết kế responsive, hoạt động tốt trên mọi thiết bị
- Gradient background đẹp mắt
- Hiệu ứng hover và animation mượt mà
- Dark/Light mode support (sẵn sàng)

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 18+** - Thư viện UI chính
- **Socket.IO Client** - Kết nối real-time
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS3** - Styling với Flexbox và Grid

### Dependencies chính
```json
{
  "react": "^18.0.0",
  "socket.io-client": "^4.0.0",
  "axios": "^1.0.0",
  "lucide-react": "^0.200.0"
}
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 16+ 
- npm hoặc yarn
- Backend server chạy tại `http://localhost:8080`

### Cài đặt
1. Clone repository:
```bash
git clone <repository-url>
cd ai-chatbot
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Khởi động ứng dụng:
```bash
npm start
# hoặc
yarn start
```

4. Mở trình duyệt và truy cập: `http://localhost:3000`

### Cấu hình Backend
Đảm bảo backend server đang chạy tại:
- **Backend URL**: `http://localhost:8080`
- **Socket URL**: `http://localhost:8080`

Để thay đổi URL backend, chỉnh sửa trong file `AIChatbot.js`:
```javascript
const BACKEND_URL = 'http://your-backend-url';
const SOCKET_URL = 'http://your-socket-url';
```

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── SliderBar/
│   │   └── Sidebar.js          # Sidebar component
│   └── common/
│       ├── BotAvatar.js        # Avatar của bot
│       ├── WelcomeMessage.js   # Tin nhắn chào mừng
│       └── MessageBubble.js    # Bubble tin nhắn
├── assets/
│   └── App.css                 # Styles chính
├── AIChatbot.js               # Component chính
└── index.js                   # Entry point
```

## 🔌 API Endpoints

### REST API
- `GET /history?limit=50` - Lấy lịch sử chat
- `DELETE /history/:chatId` - Xóa một cuộc chat

### Socket.IO Events

#### Gửi đi (Emit)
- `send` - Gửi tin nhắn chat
- `news` - Yêu cầu tin tức

#### Nhận về (Listen)
- `res` - Phản hồi tin nhắn chat
- `res_res` - Phản hồi tin tức
- `new_message` - Tin nhắn mới từ client khác
- `error` - Lỗi từ server
- `connect` - Kết nối thành công
- `disconnect` - Mất kết nối
- `connect_error` - Lỗi kết nối

## 🎯 Cách sử dụng

### Gửi tin nhắn
1. Nhập nội dung vào ô chat
2. Nhấn **Enter** để gửi hoặc click nút Send
3. Sử dụng **Shift + Enter** để xuống dòng

### Quản lý chat
- Click vào **menu hamburger** để mở sidebar
- Chọn cuộc chat từ lịch sử
- Click **"New Chat"** để tạo cuộc trò chuyện mới
- Click icon **trash** để xóa chat

### Yêu cầu tin tức
- Click nút **"Tin tức mới nhất"** trong welcome message
- Hoặc gõ yêu cầu tin tức trong chat

## ⚙️ Tùy chỉnh

### Thay đổi theme colors
Chỉnh sửa CSS variables trong `App.css`:
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #8b5cf6;
  --background-gradient: linear-gradient(135deg, #dbeafe, #ffffff, #faf5ff);
}
```

### Cấu hình Socket.IO
Điều chỉnh options trong `useEffect`:
```javascript
const newSocket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnectionDelay: 1000,
  reconnectionAttempts: 5,
  timeout: 20000,
});
```

## 🐛 Xử lý lỗi

### Lỗi kết nối
- Kiểm tra backend server có đang chạy không
- Verify URL trong cấu hình
- Check firewall và network settings

### Lỗi tin nhắn không gửi được
- Kiểm tra trạng thái kết nối
- Thử refresh trang
- Check console logs

### Lỗi lịch sử chat
- Verify API endpoints
- Check backend database connection
- Clear browser cache

## 🔒 Bảo mật

- Input validation cho tin nhắn
- XSS protection
- CORS configuration required cho backend
- Rate limiting nên được implement ở backend

## 🚀 Deployment

### Build production
```bash
npm run build
# hoặc 
yarn build
```

### Deploy options
- **Netlify**: Upload build folder
- **Vercel**: Connect GitHub repository  
- **Firebase Hosting**: Use Firebase CLI
- **Custom server**: Serve build folder with nginx/apache

## 📈 Performance Tips

- Messages được paginate để tránh render quá nhiều
- Auto-scroll được optimize
- Socket connection reuse
- Debounce typing indicators

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Create Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- **Project Link**: [GitHub Repository](https://github.com/yourusername/ai-chatbot)
- **Documentation**: [Wiki](https://github.com/yourusername/ai-chatbot/wiki)
- **Issues**: [Bug Reports](https://github.com/yourusername/ai-chatbot/issues)

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Library
- [Socket.IO](https://socket.io/) - Real-time communication
- [Lucide](https://lucide.dev/) - Beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
