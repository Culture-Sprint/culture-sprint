
import { OpenAIMessage, SentimentAnalysisRequest, ErrorCode } from "../types.ts";
import { corsHeaders, createErrorResponse } from "../utils.ts";
import { processOpenAIRequest } from "./handlerUtils.ts";

/**
 * Handle sentiment analysis requests
 */
export async function handleSentimentAnalysisRequest(requestData: SentimentAnalysisRequest, requestId: string): Promise<Response> {
  // Ensure emotion is provided
  if (!requestData.emotion || requestData.emotion === "unspecified") {
    console.log(`[${requestId}] No emotion provided, defaulting to neutral`);
    return new Response(
      JSON.stringify({ sentiment: "neutral" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  
  console.log(`[${requestId}] Processing sentiment analysis for emotion: "${requestData.emotion}"`);
  
  const systemPrompt = `You are an AI assistant that classifies emotions. 
Given an emotion word or phrase, classify it as either "positive", "negative", or "neutral".

Examples:
- Happy → positive
- Sad → negative
- Indifferent → neutral
- Angry → negative
- Excited → positive
- Content → positive
- Confused → neutral
- Anxious → negative
- Empowered → positive
- Engaged → positive
- Enthusiastic → positive
- Frustrated → negative

Respond with ONLY one of these three words: "positive", "negative", or "neutral".`;
  
  // Create messages array for the API
  const messages: OpenAIMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: requestData.emotion }
  ];
  
  try {
    // Use the shared function to process the request to OpenAI
    const response = await processOpenAIRequest(messages, requestId);
    
    // Convert the response to JSON
    const responseData = await response.json();
    
    // Validate the response
    const assistantResponse = responseData.response || "";
    console.log(`[${requestId}] Raw AI response: "${assistantResponse}"`);
    
    let sentiment: string;
    
    if (assistantResponse.toLowerCase().includes("positive")) {
      sentiment = "positive";
    } else if (assistantResponse.toLowerCase().includes("negative")) {
      sentiment = "negative";
    } else {
      sentiment = "neutral";
    }
    
    console.log(`[${requestId}] Classified emotion "${requestData.emotion}" as "${sentiment}"`);
    
    // Return the sentiment classification
    return new Response(
      JSON.stringify({ sentiment }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`[${requestId}] Error in handleSentimentAnalysisRequest:`, error);
    return createErrorResponse(
      `Error processing request: ${error.message}`,
      500,
      {},
      ErrorCode.SERVER_ERROR
    );
  }
}
