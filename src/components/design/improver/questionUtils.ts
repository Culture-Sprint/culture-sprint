
/**
 * Extract just the question from a longer AI response
 * that might contain explanations or other text
 */
export const extractQuestionFromResponse = (response: string): string => {
  // First check if the response is empty or not a string
  if (!response || typeof response !== 'string') {
    return '';
  }

  // Remove any "quotation" marks that might surround the question
  let cleanedResponse = response.trim().replace(/^["']|["']$/g, '');
  
  // If the response starts with common AI prefixes, remove them
  cleanedResponse = cleanedResponse
    .replace(/^(here's an improved question:|improved question:|here is the improved question:|the improved question is:|suggestion:)/i, '')
    .trim();
  
  // If there's a question mark, try to extract just the question
  const questionMarkIndex = cleanedResponse.lastIndexOf('?');
  if (questionMarkIndex > 0) {
    // Find the start of the question by looking for the previous sentence ending
    let startIndex = 0;
    const previousSentenceEndings = cleanedResponse.substring(0, questionMarkIndex).match(/[.!?]\s+/g);
    
    if (previousSentenceEndings && previousSentenceEndings.length > 0) {
      // Find the position of the last sentence ending before the question mark
      const lastSentenceEndingPos = cleanedResponse.lastIndexOf(
        previousSentenceEndings[previousSentenceEndings.length - 1],
        questionMarkIndex
      );
      
      if (lastSentenceEndingPos !== -1) {
        // Start after the sentence ending and its whitespace
        startIndex = lastSentenceEndingPos + previousSentenceEndings[previousSentenceEndings.length - 1].length;
      }
    }
    
    // Extract just the question part
    return cleanedResponse.substring(startIndex, questionMarkIndex + 1).trim();
  }
  
  return cleanedResponse;
};

/**
 * Clean up question text by:
 * - Removing dashes and unnecessary punctuation
 * - Ensuring proper spacing
 * - Capitalizing first letter
 * - Ensuring question ends with exactly one question mark
 */
export const cleanQuestionText = (text: string): string => {
  // First check if the text is empty or not a string
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // If text is just question marks or very short, return empty string
  if (text.trim() === '?' || text.trim() === '? ?' || text.length < 3) {
    return '';
  }

  // Main cleaning process
  let cleanedText = text
    // Remove any surrounding quotes
    .replace(/^["']|["']$/g, '')
    // Remove any leading/trailing dashes or spaces
    .trim()
    .replace(/^-+|-+$/g, '')
    // Remove common AI prefixes that might have been missed
    .replace(/^(here's a question:|question:|suggested question:)/i, '')
    // Replace dashes inside text with spaces
    .replace(/-+/g, ' ')
    // Fix spaces around punctuation
    .replace(/\s+([.,?!])/g, '$1')
    // Ensure single space after punctuation
    .replace(/([.,?!])\s*/g, '$1 ')
    // Remove double spaces
    .replace(/\s+/g, ' ')
    // Capitalize first letter
    .replace(/^[a-z]/, letter => letter.toUpperCase())
    // Trim again to remove any trailing spaces
    .trim();
    
  // Special handling for question marks - ensure exactly one at the end
  // First remove any trailing question marks
  cleanedText = cleanedText.replace(/\?+$/, '');
  
  // Then add a single question mark if needed
  if (!cleanedText.endsWith('?')) {
    cleanedText += '?';
  }
  
  return cleanedText;
};

/**
 * Process and clean up a response from the AI service
 */
export const processAIResponse = (response: string): string => {
  // Safety check for null or undefined values
  if (!response) {
    console.warn("Received empty response in processAIResponse");
    return "";
  }
  
  try {
    // First extract just the question part
    const extractedQuestion = extractQuestionFromResponse(response);
    
    // Then clean it up
    const cleanedQuestion = cleanQuestionText(extractedQuestion);
    
    // Only return the cleaned question if it's not empty
    if (cleanedQuestion && cleanedQuestion.trim().length > 3) {
      return cleanedQuestion;
    }
    
    // If cleaning resulted in an empty or very short string, 
    // return a default question rather than an invalid one
    return "Please share your story with us.";
  } catch (error) {
    console.error("Error processing AI response:", error);
    // Return a default question if processing fails
    return "Please share your story with us.";
  }
};
