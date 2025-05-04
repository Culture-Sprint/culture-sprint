import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { useChatGpt } from "@/hooks/useChatGpt";
import { ChatMessage } from "@/types/chatTypes";
import ChatDebugInfo from "./ChatDebugInfo";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
interface ChatGptProps {
  projectContext?: string;
  title?: string;
  initialQuestion?: string;
  onQuestionSent?: () => void;
  showDebugButton?: boolean;
  autoScroll?: boolean;
  onChatContentChange?: (messages: ChatMessage[]) => void;
}
const ChatGpt: React.FC<ChatGptProps> = ({
  projectContext = '',
  title = 'ChatGPT Assistant',
  initialQuestion,
  onQuestionSent,
  showDebugButton = false,
  autoScroll = true,
  onChatContentChange
}) => {
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    debugInfo
  } = useChatGpt(projectContext);
  const initialQuestionSent = useRef(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Handle initial question sending
  useEffect(() => {
    if (initialQuestion && !initialQuestionSent.current && messages.length === 0 && !isLoading) {
      sendMessage(initialQuestion);
      initialQuestionSent.current = true;
      if (onQuestionSent) {
        onQuestionSent();
      }
    }
  }, [initialQuestion, messages.length, isLoading, sendMessage, onQuestionSent]);

  // Notify parent component when chat content changes
  useEffect(() => {
    if (onChatContentChange) {
      onChatContentChange(messages);
    }
  }, [messages, onChatContentChange]);
  const handleClearChat = () => {
    clearChat();
    initialQuestionSent.current = false;
  };
  return <Card className="w-full max-w-2xl mx-auto shadow-sm border border-gray-200">
      
      
      <CardContent className="p-0">
        <ScrollArea ref={scrollAreaRef} className="h-80 w-full">
          <div className="p-4">
            <ChatMessages messages={messages} isLoading={isLoading} initialQuestion={initialQuestion} autoScroll={autoScroll} />
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t p-4">
        <ChatInput isLoading={isLoading} onSendMessage={sendMessage} onClearChat={handleClearChat} messagesExist={messages.length > 0} />
      </CardFooter>
    </Card>;
};
export default ChatGpt;