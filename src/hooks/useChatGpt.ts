import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { chatGptService } from "@/services/chatGptService";
import { ChatMessage, ChatDebugInfo } from "@/types/chatTypes";

export const useChatGpt = (initialContext: string = '') => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<ChatDebugInfo | null>(null);
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await chatGptService.callChatGpt({
        prompt: message,
        projectContext: initialContext
      });
      
      // Update debug info
      setDebugInfo({
        prompt: message,
        context: initialContext,
        response: result.response || null
      });
      
      if (result.error) {
        setError(result.error);
        toast({
          title: "Error getting response",
          description: result.error,
          variant: "destructive"
        });
      } else if (result.response) {
        // Add AI response to chat
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: result.response,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err: any) {
      const errorMessage = err.message || "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    debugInfo
  };
};
