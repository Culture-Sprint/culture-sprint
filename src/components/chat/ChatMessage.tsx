
import React from "react";
import { ChatMessage } from "@/types/chatTypes";

interface ChatMessageProps {
  message: ChatMessage;
}

const ChatMessageComponent: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser 
            ? 'bg-culturesprint-100 text-gray-800' 
            : 'bg-[#7A0266] text-white'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {message.timestamp && (
          <div className={`text-xs mt-1 ${isUser ? 'text-gray-600' : 'text-gray-200'}`}>
            {message.timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageComponent;
