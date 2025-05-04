
import { extractQuestionFromResponse, cleanQuestionText } from "../improver/questionUtils";

/**
 * Format a question for display by cleaning it
 */
export const formatQuestionForDisplay = (questionText: string): string => {
  // First extract just the question part if it's embedded in a larger text
  const extractedQuestion = extractQuestionFromResponse(questionText);
  
  // Then clean any surrounding quotes
  return cleanQuestionText(extractedQuestion);
};

/**
 * Determine if we should update the display question when props change
 */
export const shouldUpdateDisplayQuestion = (
  currentQuestion: string | null,
  response: string,
  mode: 'general' | 'storyQuestion'
): { shouldUpdate: boolean; newQuestion: string } => {
  // If we have a current question from props, prioritize that
  if (currentQuestion) {
    return { 
      shouldUpdate: true, 
      newQuestion: formatQuestionForDisplay(currentQuestion) 
    };
  }
  
  // If we have a response but no current question, use the response
  if (response) {
    const extracted = mode === 'storyQuestion' 
      ? extractQuestionFromResponse(response) 
      : response;
    
    return { 
      shouldUpdate: true, 
      newQuestion: extracted 
    };
  }
  
  // No update needed
  return { shouldUpdate: false, newQuestion: '' };
};
