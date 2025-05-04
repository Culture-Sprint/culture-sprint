
/**
 * Handles making requests to the AI service
 */
import { Project } from "@/types/project";
import { chatGptService } from "@/services/chatGptService";
import { aiAssistantService } from "@/services/aiAssistantService";
import { buildFullPrompt, createSliderQuestionPrompt } from "./promptBuilder";
import { updateDebugInfoField } from "./debugInfo";
import { getStorageItem } from "@/services/utils/storageUtils";

/**
 * Sends a request to the AI service to generate slider questions
 */
export const sendAIRequest = async (
  factors: string[],
  projectContext: string,
  activeProject: Project | null
): Promise<string | null> => {
  try {
    if (!factors || !projectContext) {
      console.error("Missing factors or context for AI request");
      return null;
    }
    
    console.log("Sending AI request with context length:", projectContext.length);
    
    // Generate the prompt using the template from database
    const prompt = await createSliderQuestionPrompt(factors, activeProject?.name || 'Project');
    
    // Build the full prompt with context
    const fullPrompt = buildFullPrompt(projectContext, prompt);
    
    // Get user's preferred AI provider
    const userProvider = getStorageItem('culturesprint_ai_provider', 'openai') as 'openai' | 'perplexity';
    console.log(`Using AI provider: ${userProvider}`);
    
    // First try using the AI assistant service
    try {
      const { response, error } = await aiAssistantService.callAssistant({
        prompt: prompt,
        projectContext: projectContext,
        mode: 'general',
        provider: userProvider
      });
      
      if (error || !response) {
        console.error(`Error from ${userProvider} AI assistant service:`, error);
        throw new Error("AI assistant service failed");
      }
      
      console.log("Received AI response:", response.substring(0, 200) + "...");
      return response;
    } catch (assistantError) {
      console.error(`${userProvider} AI service failed, falling back to ChatGPT service:`, assistantError);
      
      // Fall back to the ChatGPT service
      const { response, error } = await chatGptService.callChatGpt({
        prompt: fullPrompt
      });
      
      if (error || !response) {
        console.error("Error from ChatGPT service:", error);
        throw new Error("ChatGPT service failed");
      }
      
      console.log("Received ChatGPT response:", response.substring(0, 200) + "...");
      return response;
    }
  } catch (error) {
    console.error("Failed to send AI request:", error);
    updateDebugInfoField('error', String(error instanceof Error ? error.message : error));
    return null;
  }
};
