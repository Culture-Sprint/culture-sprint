
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

interface ChatRequest {
  prompt: string;
  projectContext?: string;
}

interface ChatResponse {
  response: string | null;
  error: string | null;
}

/**
 * Service for interacting with ChatGPT via Supabase Edge Function
 */
export const chatGptService = {
  /**
   * Call ChatGPT with a prompt and optional context
   */
  async callChatGpt({ prompt, projectContext = '' }: ChatRequest): Promise<ChatResponse> {
    try {
      console.log('Calling ChatGPT edge function with prompt:', prompt);
      
      const { data, error } = await supabase.functions.invoke('chatgpt', {
        body: { 
          prompt,
          projectContext,
          requestType: 'general'
        },
      });
      
      if (error) {
        console.error('ChatGPT edge function error:', error);
        return {
          response: null,
          error: `Error: ${error.message}`
        };
      }
      
      if (data && data.error) {
        console.error('ChatGPT edge function returned error:', data);
        return {
          response: null,
          error: data.error
        };
      }
      
      if (!data || !data.response) {
        console.error('Invalid response from ChatGPT edge function:', data);
        return {
          response: null,
          error: 'Received invalid response from ChatGPT'
        };
      }
      
      return {
        response: data.response,
        error: null
      };
    } catch (error: any) {
      console.error("Error calling ChatGPT:", error);
      return {
        response: null,
        error: error.message || "Failed to get response from ChatGPT"
      };
    }
  }
};
