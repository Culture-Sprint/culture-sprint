
import { OpenAIMessage, OpenAIRequestBody, OpenAIResponse, ErrorCode } from "./types.ts";

// OpenAI API configuration
const OPENAI_MODEL = "gpt-4o-mini"; // Using the recommended model
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 15000; // 15 seconds timeout

/**
 * Send a request to the OpenAI API with improved error handling
 */
export async function sendOpenAIRequest(messages: OpenAIMessage[], requestId: string): Promise<OpenAIResponse> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!apiKey) {
    console.error(`[${requestId}] OpenAI API key not found in environment variables`);
    throw new Error("OpenAI API key is required but was not found in environment variables");
  }

  // Parameters optimized for network diagram theme analysis
  const requestBody: OpenAIRequestBody = {
    model: OPENAI_MODEL,
    messages: messages,
    temperature: 0.3,  // Lower temperature for more consistent responses
    max_tokens: 800,   // Adequate token count for theme analysis JSON
    presence_penalty: 0.1,
    frequency_penalty: 0.1
  };

  console.log(`[${requestId}] Sending request to OpenAI API with max_tokens: ${requestBody.max_tokens}`);
  console.log(`[${requestId}] Request messages count: ${messages.length}`);

  try {
    // Create abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });
    
    // Clear timeout after response is received
    clearTimeout(timeoutId);

    if (!response.ok) {
      // Handle HTTP errors from OpenAI
      const errorText = await response.text();
      const statusCode = response.status;
      console.error(`[${requestId}] OpenAI API returned status ${statusCode}:`, errorText);
      
      // Map common HTTP errors to specific error codes
      let errorCode = ErrorCode.OPENAI_ERROR;
      if (statusCode === 401) {
        errorCode = ErrorCode.INVALID_API_KEY;
      } else if (statusCode === 429) {
        errorCode = ErrorCode.RATE_LIMIT;
      } else if (statusCode === 504 || statusCode === 524) {
        errorCode = ErrorCode.TIMEOUT;
      }
      
      throw new Error(`OpenAI API error (${statusCode}): ${errorText}`);
    }

    // Parse the response
    const responseJson = await response.json();
    console.log(`[${requestId}] OpenAI API response received successfully`);
    console.log(`[${requestId}] Response tokens: ${JSON.stringify(responseJson.usage || {})}`);
    
    return responseJson as OpenAIResponse;
  } catch (error) {
    // Enhanced error handling with specific error types
    console.error(`[${requestId}] Error sending request to OpenAI API:`, error);
    
    // Determine if this is a timeout or abort error
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${REQUEST_TIMEOUT_MS/1000} seconds`);
    }
    
    // Re-throw the original error with context
    throw error;
  }
}
