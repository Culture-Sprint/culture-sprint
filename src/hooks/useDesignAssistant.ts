
import { useState, useEffect, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useProject } from "@/contexts/ProjectContext";
import { buildProjectContext } from "@/utils/project-context";
import { aiAssistantService } from "@/services/aiAssistantService";
import { ChatMessage, AssistantMode } from "@/types/chatTypes";
import { useAIProvider } from "@/contexts/AIProviderContext";

interface UseDesignAssistantProps {
  mode?: AssistantMode;
  projectContext?: string;
}

export const useDesignAssistant = ({ 
  mode = 'general',
  projectContext = ''
}: UseDesignAssistantProps) => {
  const { activeProject } = useProject();
  const { provider } = useAIProvider();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [autoPrompt] = useState(
    mode === 'storyQuestion' 
      ? "Suggest a story question for my project"
      : ""
  );
  const [response, setResponse] = useState("");

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    const promptToUse = customPrompt || prompt.trim();
    
    if (!promptToUse) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);
      
      const userMessage: ChatMessage = {
        role: 'user',
        content: promptToUse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      setPrompt("");
      
      let context = projectContext;
      
      if (mode === 'storyQuestion' && !context && activeProject) {
        context = await buildProjectContext(activeProject);
      }
      
      const result = await aiAssistantService.callAssistant({
        prompt: promptToUse,
        projectContext: context,
        mode,
        provider
      });
      
      if (result.error) {
        setErrorCode(result.errorCode || null);
        throw new Error(result.error);
      }
      
      const responseText = result.response || "";
      
      if (responseText) {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: responseText,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setResponse(responseText);
        
        toast({
          title: "Success",
          description: "Received response from AI assistant",
        });
      } else {
        toast({
          title: "Warning",
          description: "Received empty response from AI assistant",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error calling AI assistant:", error);
      setError(error.message || "Failed to get response from AI assistant");
      toast({
        title: "Error",
        description: error.message || "Failed to get response from AI assistant",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStoryQuestion = useCallback(() => {
    console.log("[useDesignAssistant] Generating story question with prompt:", autoPrompt);
    handleSubmit(undefined, autoPrompt);
  }, [autoPrompt]);

  const clearChat = () => {
    setMessages([]);
    setResponse("");
    setError(null);
  };

  return {
    prompt,
    setPrompt,
    messages,
    loading,
    error,
    errorCode,
    handleSubmit,
    handleGenerateStoryQuestion,
    clearChat,
    response,
    setResponse,
    provider
  };
};
