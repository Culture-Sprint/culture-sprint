
// Default story question to use when nothing is saved and we explicitly need a fallback
export const DEFAULT_STORY_QUESTION = "";

/**
 * Process AI response to extract a clean question string
 */
export const processAIResponse = (response: string): string => {
  if (!response) return "";
  
  // Clean up the response
  return response.trim();
};

/**
 * Extract question from legacy response format
 */
export const extractQuestionFromLegacyResponse = (responseData: any): string | null => {
  if (!responseData) return null;
  
  // Handle string response
  if (typeof responseData === 'string') {
    return responseData.trim();
  }
  
  // Handle object response
  if (typeof responseData === 'object') {
    // Check for question property
    if ('question' in responseData && typeof responseData.question === 'string') {
      return responseData.question.trim();
    }
    
    // Check for storyQuestion property
    if ('storyQuestion' in responseData && typeof responseData.storyQuestion === 'string') {
      return responseData.storyQuestion.trim();
    }
  }
  
  return null;
};
