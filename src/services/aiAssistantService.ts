
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { AIAssistantRequest, AIAssistantResponse } from "@/types/chatTypes";
import { perplexityService } from "./perplexityService";
import { getStorageItem } from "@/services/utils/storageUtils";

/**
 * Service for interacting with the AI Assistant via Supabase Edge Function
 */
export const aiAssistantService = {
  /**
   * Call the AI assistant with a prompt and context
   */
  async callAssistant({
    prompt,
    projectContext = '',
    mode = 'general',
    provider
  }: AIAssistantRequest & { provider?: 'openai' | 'perplexity' }): Promise<AIAssistantResponse> {
    try {
      // If no provider specified, get from localStorage
      const effectiveProvider = provider || 
        getStorageItem('culturesprint_ai_provider', 'openai') as 'openai' | 'perplexity';
      
      console.log(`Using AI provider: ${effectiveProvider}`);
      
      // Use Perplexity service if specified
      if (effectiveProvider === 'perplexity') {
        return await perplexityService.callPerplexity({
          prompt,
          projectContext,
          mode
        });
      }
      
      // Default to OpenAI
      const { data, error } = await supabase.functions.invoke('chatgpt', {
        body: { 
          prompt,
          projectContext,
          requestType: mode === 'storyQuestion' ? 'storyQuestion' : 'general'
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
      
      console.log('Response from edge function:', data);
      
      if (!data || !data.response) {
        console.error('Invalid response from AI assistant:', data);
        return {
          response: null,
          error: 'Received invalid response from AI assistant',
          errorCode: null
        };
      }
      
      const responseText = data.response || "";
      console.log('AI response received:', responseText.substring(0, 100) + '...');
      
      return {
        response: responseText,
        error: null,
        errorCode: null
      };
    } catch (error: any) {
      console.error("Error calling AI assistant:", error);
      return {
        response: null,
        error: error.message || "Failed to get response from AI assistant",
        errorCode: null
      };
    }
  }
};
