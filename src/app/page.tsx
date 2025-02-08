"use client";

import AnimatedBackground from '@/components/AnimatedBackground';
import ChatInterface from '@/components/ChatInterface';
import { useState } from 'react';

export default function Home() {
  const [key, setKey] = useState(0);

  const handleEndChat = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen relative flex flex-col">
      <AnimatedBackground />
      
      {/* Top right button */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
        <button 
          className="bg-gradient-to-r from-red-600 to-red-400 text-white 
            px-3 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base
            shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          onClick={handleEndChat}
        >
          End Chat & Continue
        </button>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-2 sm:px-4 pt-12 sm:pt-16 flex-1">
        <ChatInterface key={key} onEndChat={handleEndChat} />
      </div>
    </div>
  );
}
