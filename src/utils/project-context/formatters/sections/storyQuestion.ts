
/**
 * Story question formatting module
 */

/**
 * Format story question
 */
export const formatStoryQuestion = (rawData: Record<string, any>): string => {
  let text = '\n\nSTORY QUESTION:\n';
  
  if (rawData.storyQuestion) {
    const data = rawData.storyQuestion;
    
    if (typeof data === 'string') {
      text += `• ${data}\n`;
      return text;
    } else if (data && typeof data === 'object') {
      if (data.question) {
        text += `• ${data.question}\n`;
        return text;
      }
      
      if (data.story_question) {
        text += `• ${data.story_question}\n`;
        return text;
      }
      
      // Check for any field that might contain the story question
      for (const [key, value] of Object.entries(data)) {
        if (
          (key.includes('question') || key.includes('prompt')) && 
          typeof value === 'string' && 
          value.trim()
        ) {
          text += `• ${value}\n`;
          return text;
        }
      }
    }
  }
  
  return '';
};
