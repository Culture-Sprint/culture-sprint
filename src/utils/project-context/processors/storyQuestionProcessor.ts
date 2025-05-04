
/**
 * Process story question
 */
export function processStoryQuestion(context: string, activityResponses: Record<string, any>): string {
  let storyQContext = '';
  let hasStoryQ = false;
  
  // Multiple possible keys for story questions
  const storyQuestionKeys = ['storyQuestion', 'story_question', 'mainQuestion', 'question', 'storyPrompt'];
  
  // Try all possible locations for story questions
  for (const key of storyQuestionKeys) {
    if (activityResponses[key]) {
      try {
        let storyQ = "";
        if (typeof activityResponses[key] === 'string') {
          storyQ = activityResponses[key];
          hasStoryQ = true;
        } else if (typeof activityResponses[key] === 'object' && activityResponses[key] !== null) {
          // Try to find the question in various possible structures
          const questionFields = ['storyQuestion', 'question', 'story_question', 'text', 'finalQuestion', 'prompt'];
          
          for (const field of questionFields) {
            if (activityResponses[key][field]) {
              storyQ = activityResponses[key][field];
              hasStoryQ = true;
              break;
            }
          }
          
          // If we still don't have a question, look through all fields for text
          if (!hasStoryQ) {
            Object.entries(activityResponses[key]).forEach(([field, value]) => {
              if (typeof value === 'string' && value.trim().length > 15) {
                storyQ = value;
                hasStoryQ = true;
              }
            });
          }
        }
        
        if (hasStoryQ) {
          storyQContext = `\nMAIN STORY QUESTION: "${storyQ}"\n`;
          break; // We found a story question, no need to check other keys
        }
      } catch (e) {
        console.error(`Error processing story question data from ${key}:`, e);
      }
    }
  }
  
  // Try alternate location if we still don't have a story question
  if (!hasStoryQ && activityResponses.storyQuestionData) {
    try {
      const data = activityResponses.storyQuestionData;
      if (typeof data === 'string') {
        storyQContext = `\nMAIN STORY QUESTION: "${data}"\n`;
      } else if (typeof data === 'object' && data !== null) {
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === 'string' && value.trim().length > 15) {
            storyQContext = `\nMAIN STORY QUESTION: "${value}"\n`;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Error processing storyQuestionData:", e);
    }
  }
  
  return context + storyQContext;
}
