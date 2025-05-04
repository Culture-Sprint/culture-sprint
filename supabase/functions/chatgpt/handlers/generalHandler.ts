
import { OpenAIMessage, RequestData, ErrorCode } from "../types.ts";
import { corsHeaders, createErrorResponse } from "../utils.ts";
import { formatProjectContext, processOpenAIRequest } from "./handlerUtils.ts";
import { getPromptContent } from "../promptService.ts";

/**
 * Handle general requests
 */
export async function handleGeneralRequest(requestData: RequestData, requestId: string): Promise<Response> {
  try {
    // Get system prompt from database or fall back to default
    const systemPrompt = await getPromptContent('general_assistant_system',
      "You are an AI assistant for a participatory narrative inquiry project. Provide thoughtful, concise responses to user queries. Focus on helping the user design their project with clarity and purpose.");
    
    // Create messages array for the API
    const messages: OpenAIMessage[] = [
      { role: "system", content: systemPrompt }
    ];
    
    // Format project context if available
    if (requestData.projectContext) {
      const contextMessage = formatProjectContext(requestData.projectContext, requestId);
      if (contextMessage) {
        messages.push(contextMessage);
      }
    }
    
    // Add the user's prompt
    messages.push({ role: "user", content: requestData.prompt });
    
    return await processOpenAIRequest(messages, requestId);
  } catch (error) {
    console.error(`[${requestId}] Error in handleGeneralRequest:`, error);
    throw error;
  }
}
