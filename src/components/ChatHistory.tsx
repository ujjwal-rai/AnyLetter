import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

interface ChatHistoryProps {
  onSelectChat: (chatId: string) => void;
  currentChatId: string | null;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ onSelectChat, currentChatId }) => {
  const { user } = useAuth();
  const [chats, setChats] = React.useState<Array<{ id: string, title: string, timestamp: Date }>>([]);

  React.useEffect(() => {
    if (!user) {
      setChats([]);
      return;
    }

    const q = query(
      collection(db, 'chats'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        title: doc.data().title,
        timestamp: doc.data().timestamp.toDate(),
      }));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) return null;

  return (
    <div className="w-64 h-full bg-white/10 backdrop-blur-sm border-r border-gray-200/20">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Chat History</h2>
        <div className="space-y-2">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left p-2 rounded-lg transition-all
                ${currentChatId === chat.id 
                  ? 'bg-blue-500/20 text-blue-500' 
                  : 'hover:bg-gray-500/10'}`}
            >
              <p className="text-sm truncate">{chat.title}</p>
              <p className="text-xs text-gray-500">
                {chat.timestamp.toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory; 