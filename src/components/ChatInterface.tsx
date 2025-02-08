"use client";

import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input) {
      setIsTyping(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
    } else {
      setIsTyping(false);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [input]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(input);
      const text = result.response.text();

      setMessages((prev) => [...prev, { role: "bot", content: text }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, there was an error processing your request." },
      ]);
    }

    setIsLoading(false);
  };

  const handleSkip = () => {
    setMessages([]);
    setInput("");
  };

  const handleEndChat = () => {
    setMessages([]);
    setInput("");
  };

  // Add scroll handler
  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-96px)]">
      <div className="w-full max-w-2xl mx-auto flex-1 p-2 sm:p-4 rounded-xl shadow-2xl overflow-hidden mb-[180px] sm:mb-[200px] relative">
        {/* Circular gradient background */}
        <div className="absolute inset-0 bg-gradient-radial from-white/20 via-white/10 to-transparent pointer-events-none" />
        
        {/* Chat messages container */}
        <div 
          ref={chatContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto p-2 sm:p-4 rounded-xl relative"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 sm:mb-3 p-2 sm:p-3 rounded-xl shadow-sm relative z-10 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white ml-auto max-w-[85%] sm:max-w-[80%]"
                  : "bg-gradient-to-r from-gray-700 to-gray-600 text-white mr-auto max-w-[85%] sm:max-w-[80%]"
              }`}
            >
              <div className="text-sm sm:text-base">{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="bg-gradient-to-r from-gray-700 to-gray-600 text-white mr-auto max-w-[80%] mb-4 p-4 rounded-xl relative z-10">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-[200px] sm:bottom-[220px] right-4 sm:right-8 z-30 
          bg-white/40 backdrop-blur-[2px] shadow-lg rounded-full p-2 
          hover:bg-white/60 transition-all duration-300 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 text-gray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
            />
          </svg>
        </button>
      )}

      {/* Action buttons - with top padding */}
      <div className="fixed bottom-[64px] sm:bottom-[80px] left-0 right-0 border-t border-gray-200/10 pt-4 sm:pt-6">
        <div className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-1.5 sm:gap-2 p-2 sm:p-4">
          <button
            onClick={sendMessage}
            className="flex-1 bg-gradient-to-r from-blue-600/80 to-blue-400/80 text-white px-3 sm:px-4 py-2 rounded-xl 
            shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base backdrop-blur-sm"
          >
            Help me Answer
          </button>
          <button
            onClick={handleSkip}
            className="flex-1 bg-gradient-to-r from-gray-600/80 to-gray-400/80 text-white px-3 sm:px-4 py-2 rounded-xl 
            shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base backdrop-blur-sm"
          >
            Skip Question
          </button>
          <button
            onClick={handleEndChat}
            className="flex-1 bg-gradient-to-r from-red-600/80 to-red-400/80 text-white px-3 sm:px-4 py-2 rounded-xl 
            shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base backdrop-blur-sm"
          >
            End Chat & Continue
          </button>
        </div>
      </div>

      {/* Input area - completely transparent background */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200/10">
        <div className="w-full max-w-2xl mx-auto flex gap-1.5 sm:gap-2 p-2 sm:p-4">
          <div className="relative flex-1 rounded-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="w-full p-2 bg-white/20 rounded-xl border-2 border-gray-300/30 
              focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-300 
              text-black text-sm sm:text-base placeholder-gray-500 backdrop-blur-sm"
              placeholder="Type your message..."
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className={`relative p-2 rounded-xl shadow-lg overflow-hidden min-w-[36px] sm:min-w-[44px]
            bg-gradient-to-r from-[#ff1493]/80 to-[#4169e1]/80
            text-white transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
            disabled:from-pink-300/50 disabled:to-blue-300/50 disabled:cursor-not-allowed backdrop-blur-sm`}
          >
            <span className="relative z-10">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-5 h-5 sm:w-6 sm:h-6"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" 
                />
              </svg>
            </span>
            {isTyping && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#4169e1] to-[#ff1493] animate-gradient-move opacity-100" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
