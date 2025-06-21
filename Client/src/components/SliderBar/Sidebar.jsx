import React, { useState, useRef, useEffect } from 'react';
import { ChevronRightIcon, Clock, Home, Plus, MessageSquare, Calendar, X, User, Trash2, Sparkles} from 'lucide-react';
import BotAvatar from '../common/BotAvatar';
import UserAvatar from '../common/UserAvatar';
import {formatTimestamp} from '../../static/TimeFomat.js'
// Sidebar Component
const Sidebar = ({ isOpen, setIsOpen, messages, setMessages, history, active, setActive, account }) => {
  const handleNewChat = () => {
    if (messages.length > 0) {
      setActive(-1);
      setMessages([]);
    }
  };

  const SidebarContent = () => (
    <div className="h-full bg-white shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BotAvatar />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduGuide AI
              </h1>
              <p className="text-xs text-gray-500">Trợ lý học tập thông minh</p>
            </div>
          </div>
          {isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Đoạn chat mới
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide">Lịch sử trò chuyện</h2>
        <div className="space-y-2">
          {history.length > 0 ? (
            history.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setMessages(item.chats);
                  setActive(item._id);
                  if (isOpen) setIsOpen(false);
                }}
                className={`
                  p-4 rounded-2xl cursor-pointer transition-all duration-200 group
                  ${item._id === active 
                    ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                  }
                `}
              >
                <h3 className="font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.chats[0]?.content || 'Cuộc trò chuyện mới'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{formatTimestamp(item?.createdAt)}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-500">Chưa có đoạn chat nào!</p>
              <p className="text-xs text-gray-400 mt-1">Hãy bắt đầu chat ngay</p>
            </div>
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {account?.avatar ? (
              <img src={account.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              account?.username?.charAt(0) || 'U'
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              {account?.username || 'Người dùng'}
            </h3>
            <p className="text-xs text-gray-500">
              {account?.email || 'Đăng nhập để trải nghiệm đầy đủ!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-50 lg:hidden">
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
        <div className="relative w-80 h-full">
          <SidebarContent />
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-80 h-full">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;