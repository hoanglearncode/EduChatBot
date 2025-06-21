import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Sidebar from './components/SliderBar/Sidebar';
import './assets/App.css';
import { AlignJustify, Copy, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import BotAvatar from './components/common/BotAvatar';
import WelcomeMessage from './components/common/WelcomeMessage';
import MessageBubble from './components/common/MessageBubble';
import axios from 'axios';

// Main Component
const AIChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [account, setAccount] = useState({});
  const [history, setHistory] = useState([]);
  const [active, setActive] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Cấu hình backend URLs
  const BACKEND_URL = 'http://localhost:8080';
  const SOCKET_URL = 'http://localhost:8080';

  // Kết nối Socket.IO
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      upgrade: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      maxReconnectionAttempts: 5,
      timeout: 20000,
    });

    // Lắng nghe các events
    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
    });

    // Lắng nghe phản hồi từ AI
    newSocket.on('res', (response) => {
      setIsTyping(false);
      
      if (response.success) {
        const aiMessage = {
          type: 'ai',
          content: response.data.content || response.data,
          timestamp: new Date().toISOString(),
          id: response.data.id || Date.now()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Xử lý lỗi
        const errorMessage = {
          type: 'ai',
          content: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.',
          timestamp: new Date().toISOString(),
          id: Date.now(),
          isError: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    });

    // Lắng nghe phản hồi tin tức
    newSocket.on('res_res', (response) => {
      setIsTyping(false);
      
      if (response.success) {
        const newsMessage = {
          type: 'ai',
          content: response.data.content || response.data,
          timestamp: new Date().toISOString(),
          id: response.data.id || Date.now(),
          isNews: true
        };
        setMessages(prev => [...prev, newsMessage]);
      }
    });

    // Lắng nghe tin nhắn mới từ các client khác
    newSocket.on('new_message', (message) => {
      console.log('🔔 New message from other client:', message);
      if (message.success) {
        const newMessage = {
          type: 'ai',
          content: message.data.content || message.data,
          timestamp: new Date().toISOString(),
          id: message.data.id || Date.now()
        };
        setMessages(prev => [...prev, newMessage]);
      }
    });

    // Lắng nghe lỗi
    newSocket.on('error', (error) => {
      setIsTyping(false);
      
      const errorMessage = {
        type: 'ai',
        content: error.message || 'Đã có lỗi xảy ra với kết nối.',
        timestamp: new Date().toISOString(),
        id: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    });

    // Lắng nghe lỗi kết nối
    newSocket.on('connect_error', (error) => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [SOCKET_URL]);

  // Tải lịch sử chat khi component mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Tự động scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Tải lịch sử chat từ backend
  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/history?limit=50`);
      if (response.data.success) {
        setHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('❌ Error loading chat history:', error);
    }
  };

  // Xóa lịch sử chat
  const deleteChatHistory = async (chatId) => {
    try {
      const response = await axios.delete(`${BACKEND_URL}/history/${chatId}`);
      if (response.data.success) {
        // Cập nhật lại lịch sử
        await loadChatHistory();
        // Nếu đang xem chat vừa xóa, reset messages
        if (active === chatId) {
          setMessages([]);
          setActive(-1);
        }
      }
    } catch (error) {
      console.error('❌ Error deleting chat:', error);
    }
  };

  // Gửi tin nhắn
  const sendMessage = async () => {
    if (inputValue.trim() === '' || !socket || !isConnected) {
      return;
    }

    const userMessage = {
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    // Thêm tin nhắn user vào UI
    setMessages(prev => [...prev, userMessage]);
    
    // Hiển thị typing indicator
    setIsTyping(true);
    
    // Gửi tin nhắn qua Socket.IO
    const messageData = {
      content: inputValue.trim(),
      id: active !== -1 ? active : Date.now(),
      timestamp: new Date().toISOString()
    };
    
    socket.emit('send', messageData);
    
    // Reset input
    setInputValue('');
    
    // Focus lại textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Gửi yêu cầu tin tức
  const sendNewsRequest = () => {
    if (!socket || !isConnected) {
      return;
    }

    const newsMessage = {
      type: 'user',
      content: 'Cho tôi biết tin tức mới nhất',
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    setMessages(prev => [...prev, newsMessage]);
    setIsTyping(true);
    
    socket.emit('news', { timestamp: new Date().toISOString() });
  };

  // Xử lý phím Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Copy text to clipboard
  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log('📋 Text copied to clipboard');
      // Có thể thêm toast notification ở đây
    } catch (err) {
      console.error('❌ Failed to copy:', err);
    }
  };

  // Xử lý khi chọn chat từ history
  const handleChatSelect = (chatData) => {
    setActive(chatData._id);
    setMessages(chatData.chats || []);
  };

  // Tạo chat mới
  const createNewChat = () => {
    setMessages([]);
    setActive(-1);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Sidebar 
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        messages={messages}
        setMessages={setMessages}
        history={history}
        active={active}
        setActive={setActive}
        account={account}
        onChatSelect={handleChatSelect}
        onNewChat={createNewChat}
        onDeleteChat={deleteChatHistory}
        onRefreshHistory={loadChatHistory}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
            >
              <AlignJustify size={24} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <BotAvatar />
              <div>
                <h1 className="text-xl font-bold text-gray-800">EduGuide AI</h1>
                <p className="text-sm text-gray-500">Trợ lý định hướng học tập</p>
              </div>
            </div>
          </div>
          
          <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border ${
            isConnected 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              {isConnected ? 'Đang hoạt động' : 'Mất kết nối'}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <WelcomeMessage 
                onCopy={copyToClipboard}
                onNewsRequest={sendNewsRequest}
                isConnected={isConnected}
              />
            ) : (
              <>
                {messages.map((message, idx) => (
                  <MessageBubble
                    key={`${message.id || idx}-${message.timestamp}`}
                    message={message}
                    isUser={message.type === 'user'}
                    onCopy={copyToClipboard}
                    onLike={() => console.log('👍 Message liked:', message.id)}
                    onDislike={() => console.log('👎 Message disliked:', message.id)}
                    isError={message.isError}
                    isNews={message.isNews}
                  />
                ))}
                {isTyping && (
                  <div className="flex gap-4 mb-6">
                    <BotAvatar />
                    <div className="bg-white border border-gray-100 rounded-3xl px-6 py-4 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-4">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  className="w-full resize-none bg-white border-2 border-gray-200 rounded-3xl px-6 py-4 pr-14 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200 shadow-sm"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isConnected ? "Chia sẻ mục tiêu học tập của bạn..." : "Đang kết nối..."}
                  rows={1}
                  style={{ minHeight: '56px', maxHeight: '120px' }}
                  disabled={!isConnected}
                />
                
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping || !isConnected}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
                  title={isConnected ? "Gửi tin nhắn" : "Chưa kết nối"}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
              <div>
                Nhấn <kbd className="px-2 py-1 bg-gray-100 rounded font-mono">Enter</kbd> để gửi, 
                <kbd className="px-2 py-1 bg-gray-100 rounded font-mono ml-1">Shift + Enter</kbd> để xuống dòng
              </div>
              {!isConnected && (
                <div className="text-red-500 font-medium">
                  Đang kết nối lại...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;