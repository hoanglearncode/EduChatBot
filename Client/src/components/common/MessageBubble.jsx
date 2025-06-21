import React from 'react';
import BotAvatar from './BotAvatar';
import UserAvatar from './UserAvatar';

// MessageBubble Component
const MessageBubble = ({ message, isUser, onCopy, onLike, onDislike }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return `${Math.ceil(diffDays / 7)} tuần trước`;
  };

  return (
    <div className={`flex gap-4 mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <BotAvatar />}
      
      <div className={`max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div className={`
          px-6 py-4 rounded-3xl shadow-sm
          ${isUser 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto' 
            : 'bg-white border border-gray-100 text-gray-800'
          }
        `}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className={`flex items-center gap-3 mt-2 px-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
          
          {!isUser && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onCopy(message.content)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy message"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
              <button 
                onClick={() => onLike()}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Like"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </button>
              <button 
                onClick={() => onDislike()}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Dislike"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {isUser && <UserAvatar />}
    </div>
  );
};
export default MessageBubble;