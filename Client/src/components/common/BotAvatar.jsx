import React from "react"
import { Sparkles } from "lucide-react"
export default function BotAvatar() {
  return (
    <div className='relative'>
      <div className='text-white w-10 h-10 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 p-2 rounded-2xl flex items-center justify-center shadow-lg'>
        <Sparkles size={20} className="animate-pulse" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
    </div>
  );
};