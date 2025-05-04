
import { ErrorCode, ApiErrorResponse, ErrorDetails } from "./types.ts";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number,
  details: ErrorDetails = {},
  errorCode: ErrorCode = ErrorCode.UNKNOWN_ERROR
): Response {
  const errorResponse: ApiErrorResponse = {
    error: message,
    details,
    errorCode
  };

  console.error(`Error response: [${statusCode}] ${message}`, details);

  return new Response(
    JSON.stringify(errorResponse),
    {
      status: statusCode,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    }
  );
}
