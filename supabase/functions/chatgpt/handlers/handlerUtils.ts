
import { OpenAIMessage, RequestData, ErrorCode } from "../types.ts";
import { sendOpenAIRequest } from "../openai.ts";
import { corsHeaders, createErrorResponse } from "../utils.ts";

/**
 * Shared function to process OpenAI requests with proper error handling
 */
export async function processOpenAIRequest(
  messages: OpenAIMessage[],
  requestId: string
): Promise<Response> {
  try {
    // Log the full message array for debugging
    console.log(`[${requestId}] Sending ${messages.length} messages to OpenAI:`);
    for (let i = 0; i < messages.length; i++) {
      console.log(`[${requestId}] Message ${i+1} (${messages[i].role}): ${messages[i].content.substring(0, 100)}...`);
    }
    
    // Send request to OpenAI
    const openAIResponse = await sendOpenAIRequest(messages, requestId);
    
    // Extract the assistant's response
    const assistantMessage = openAIResponse.choices[0].message;
    
    // Return the response
    return new Response(
      JSON.stringify({ response: assistantMessage.content }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error(`[${requestId}] Error in processOpenAIRequest:`, error);
    return createErrorResponse(
      `Error processing request: ${error.message}`,
      500,
      {},
      ErrorCode.SERVER_ERROR
    );
  }
}

/**
 * Format project context for inclusion in messages
 */
export function formatProjectContext(
  projectContext: string | undefined,
  requestId: string,
  contextType: string = "PROJECT"
): OpenAIMessage | null {
  if (!projectContext) return null;
  
  // Add a dedicated system message with formatted context
  const formattedContext = `IMPORTANT - ${contextType} CONTEXT:
${projectContext}

INSTRUCTIONS: Based on this specific context, provide a focused and relevant response. Your response should:
1. Directly relate to the context's goals, themes, and factors identified
2. Be clear, concise, and accessible to participants
3. Avoid leading or biased language
4. Be specific to this project's unique circumstances`;
  
  console.log(`[${requestId}] Added formatted ${contextType.toLowerCase()} context (${formattedContext.length} chars)`);
  console.log(`[${requestId}] Context preview: ${formattedContext.substring(0, 500)}...`);
  
  return { 
    role: "system", 
    content: formattedContext
  };
}
