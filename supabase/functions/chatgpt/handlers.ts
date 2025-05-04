
import { RequestData, ErrorCode } from "./types.ts";
import { createErrorResponse } from "./utils.ts";
import { handleGeneralRequest } from "./handlers/generalHandler.ts";
import { handleSentimentAnalysisRequest } from "./handlers/sentimentHandler.ts";
import { handleStoryQuestionRequest } from "./handlers/storyQuestionHandler.ts";

/**
 * Handle the main request from client
 */
export async function handleRequest(requestData: RequestData, requestId: string): Promise<Response> {
  console.log(`[${requestId}] Processing ${requestData.requestType || 'general'} request`);
  
  try {
    // Special handling for sentiment analysis which doesn't require a prompt
    if (requestData.requestType === 'sentimentAnalysis') {
      console.log(`[${requestId}] Routing to sentiment analysis handler`);
      return await handleSentimentAnalysisRequest(requestData as any, requestId);
    }
    
    // Ensure the prompt is not empty (unless it's a story question which can use default prompt)
    if (!requestData.prompt && requestData.requestType !== 'storyQuestion') {
      console.error(`[${requestId}] Empty prompt received`);
      return createErrorResponse(
        "Prompt is required",
        400,
        { requestData },
        ErrorCode.BAD_REQUEST
      );
    }
    
    // Process the request based on its type
    switch(requestData.requestType) {
      case 'storyQuestion':
        return await handleStoryQuestionRequest(requestData as any, requestId);
      default:
        return await handleGeneralRequest(requestData, requestId);
    }
  } catch (error) {
    console.error(`[${requestId}] Error in handleRequest:`, error);
    
    // Check for OpenAI API key errors
    if (error.message?.includes('OpenAI API key')) {
      return createErrorResponse(
        "OpenAI API key is missing or invalid. Please set it in the Edge Function environment variables.",
        401,
        {},
        ErrorCode.API_KEY_MISSING
      );
    }
    
    // Check for invalid API key errors
    if (error.message?.includes('401') && error.message?.includes('OpenAI API')) {
      return createErrorResponse(
        "Invalid OpenAI API key. Please check your API key and try again.",
        401,
        {},
        ErrorCode.INVALID_API_KEY
      );
    }
    
    // Handle timeout errors
    if (error.message?.includes('timeout') || error.message?.includes('504') || error.message?.includes('524')) {
      return createErrorResponse(
        "Request timed out while waiting for AI response. Please try again.",
        504,
        {},
        ErrorCode.TIMEOUT
      );
    }
    
    return createErrorResponse(
      `Error processing request: ${error.message}`,
      500,
      {},
      ErrorCode.SERVER_ERROR
    );
  }
}
