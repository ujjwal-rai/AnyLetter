"use client";

import AnimatedBackground from '@/components/AnimatedBackground';
import ChatInterface from '@/components/ChatInterface';
import ChatHistory from '@/components/ChatHistory';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function Home() {
  const { user, signInWithGoogle, signOutUser, loading } = useAuth();
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex">
      <AnimatedBackground />
      
      {/* Top right auth button */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20">
        {user ? (
          <div className="flex items-center gap-4">
            <img 
              src={user.photoURL || ''} 
              alt={user.displayName || ''} 
              className="w-8 h-8 rounded-full"
            />
            <button 
              onClick={signOutUser}
              className="bg-gradient-to-r from-red-600 to-red-400 text-white 
                px-3 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base
                shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={handleSignIn}
            disabled={isSigningIn}
            className={`bg-gradient-to-r from-blue-600 to-blue-400 text-white 
              px-3 py-2 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base
              shadow-lg hover:shadow-xl transition-all duration-300 
              ${isSigningIn ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
          >
            {isSigningIn ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in with Google"
            )}
          </button>
        )}
      </div>

      {/* Chat history sidebar */}
      <ChatHistory 
        onSelectChat={setCurrentChatId}
        currentChatId={currentChatId}
      />

      {/* Main content */}
      <div className="flex-1">
        <div className="container mx-auto px-2 sm:px-4 pt-12 sm:pt-16 flex-1">
          <ChatInterface 
            chatId={currentChatId}
            onNewChat={() => setCurrentChatId(null)}
          />
        </div>
      </div>
    </div>
  );
}
