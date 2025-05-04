
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ChatMessage, AIAssistantRequest, AIAssistantResponse } from "@/types/chatTypes";

/**
 * Service for interacting with Perplexity AI via Supabase Edge Function
 */
export const perplexityService = {
  /**
   * Call Perplexity AI with a prompt and context
   */
  async callPerplexity({
    prompt,
    projectContext = '',
    mode = 'general'
  }: AIAssistantRequest): Promise<AIAssistantResponse> {
    try {
      console.log('Calling Perplexity AI edge function with:', {
        prompt,
        projectContext,
        mode
      });
      
      const { data, error } = await supabase.functions.invoke('chatgpt', {
        body: { 
          prompt,
          projectContext,
          requestType: 'perplexity',
          mode
        },
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        return {
          response: null,
          error: `Edge function error: ${error.message}`,
          errorCode: null
        };
      }
      
      if (data && data.error) {
        console.error('Edge function returned error:', data);
        return {
          response: null,
          error: data.error,
          errorCode: data.errorCode || null
        };
      }
      
      console.log('Response from Perplexity:', data);
      
      if (!data || !data.response) {
        console.error('Invalid response from Perplexity:', data);
        return {
          response: null,
          error: 'Received invalid response from Perplexity AI',
          errorCode: null
        };
      }
      
      const responseText = data.response || "";
      console.log('Perplexity response received:', responseText.substring(0, 100) + '...');
      
      return {
        response: responseText,
        error: null,
        errorCode: null
      };
    } catch (error: any) {
      console.error("Error calling Perplexity AI:", error);
      return {
        response: null,
        error: error.message || "Failed to get response from Perplexity AI",
        errorCode: null
      };
    }
  }
};
