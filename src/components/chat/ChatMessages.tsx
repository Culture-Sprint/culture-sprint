
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/types/chatTypes";
import ChatMessageComponent from "./ChatMessage";

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  initialQuestion?: string;
  autoScroll: boolean;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading, 
  initialQuestion,
  autoScroll
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [messages, autoScroll]);
  
  if (messages.length === 0) {
    return (
      <div className="flex h-full min-h-[280px] items-center justify-center text-gray-500 text-sm">
        {isLoading && initialQuestion 
          ? `Sending: "${initialQuestion}"` 
          : "Start a conversation with your AI Assistant"}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <ChatMessageComponent key={idx} message={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
