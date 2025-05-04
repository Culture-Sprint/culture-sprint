
/**
 * Main entry point for the chatgpt edge function
 */
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createErrorResponse } from "./utils.ts";
import { RequestData, ErrorCode } from "./types.ts";
import { handleRequest } from "./handlers.ts";

// Main request handler
serve(async (req) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Received request: ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    let requestData: RequestData;
    try {
      const requestText = await req.text();
      if (!requestText || requestText.trim() === '') {
        console.error(`[${requestId}] Empty request body`);
        return createErrorResponse(
          'Empty request body',
          400,
          {},
          ErrorCode.BAD_REQUEST
        );
      }
      
      // Safely parse JSON
      try {
        requestData = JSON.parse(requestText);
      } catch (parseError) {
        console.error(`[${requestId}] JSON parse error:`, parseError);
        return createErrorResponse(
          'Invalid JSON in request body',
          400,
          {},
          ErrorCode.INVALID_JSON
        );
      }
    } catch (e) {
      console.error(`[${requestId}] Failed to read request body:`, e);
      return createErrorResponse(
        'Failed to read request body',
        400,
        {},
        ErrorCode.BAD_REQUEST
      );
    }

    // Process the request using our handler router
    console.log(`[${requestId}] Request parsed successfully, forwarding to handler`);
    return await handleRequest(requestData, requestId);
  } catch (error) {
    console.error(`[${requestId}] Unhandled error in chatgpt function:`, error);
    return createErrorResponse(
      error.message || 'An unexpected error occurred',
      500,
      {},
      ErrorCode.SERVER_ERROR
    );
  }
});
