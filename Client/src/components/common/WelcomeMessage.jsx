import React from 'react';
import BotAvatar from './BotAvatar';
import { Sparkles } from 'lucide-react';

// WelcomeMessage Component
const WelcomeMessage = ({ onCopy }) => {
  return (
    <div className="flex gap-4 mb-6">
      <BotAvatar />
      <div className="bg-white border border-gray-100 rounded-3xl px-6 py-5 shadow-sm max-w-[80%]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-800">Chào mừng bạn đến với EduGuide AI!</h3>
            <Sparkles size={20} className="text-purple-500" />
          </div>
          
          <p className="text-gray-600">Tôi là trợ lý AI chuyên về định hướng giáo dục và phát triển nghề nghiệp. Tôi có thể giúp bạn:</p>
          
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: "🎯", title: "Phân tích năng lực cá nhân", desc: "Đánh giá điểm mạnh, sở thích" },
              { icon: "🚀", title: "Định hướng nghề nghiệp", desc: "Tư vấn ngành học và con đường phát triển" },
              { icon: "📚", title: "Lập lộ trình học tập", desc: "Kế hoạch chi tiết theo mục tiêu" },
              { icon: "💪", title: "Phát triển kỹ năng", desc: "Soft skills và hard skills cần thiết" },
              { icon: "📈", title: "Cập nhật xu hướng", desc: "Ngành nghề hot và cơ hội việc làm" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
            <p className="text-center text-gray-700">
              <span className="font-medium">💡 Hãy bắt đầu bằng cách chia sẻ về bản thân hoặc mục tiêu của bạn!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WelcomeMessage;