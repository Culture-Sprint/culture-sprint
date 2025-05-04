
import { processAIResponse } from '../storyQuestionSyncBase';
import { saveActivityResponse } from '../operations';

/**
 * Prepare question for saving by cleaning and validating it
 */
export const prepareQuestionForSaving = (question: string): string | null => {
  if (!question || question.trim().length === 0) {
    return "";
  }
  
  // Process the question to ensure it's clean and valid
  const processedQuestion = processAIResponse(question);
  
  if (!processedQuestion || processedQuestion.trim().length === 0) {
    console.warn(`Cannot save empty question: "${question}" processed to "${processedQuestion}"`);
    return "";
  }
  
  return processedQuestion;
};

/**
 * Saves a story question directly to public-story-questions activity
 */
export const saveToPublicStoryQuestions = async (
  projectId: string,
  question: string
): Promise<boolean> => {
  console.log(`Saving to public-story-questions for project ${projectId}: "${question}"`);
  
  try {
    const success = await saveActivityResponse(
      projectId,
      'collection',
      'public-form',
      'public-story-questions',
      { question }
    );
    
    return success;
  } catch (error) {
    console.error(`Error saving to public-story-questions: ${error}`);
    return false;
  }
};

/**
 * Saves a story question to the public form configuration
 */
export const saveToPublicFormConfiguration = async (
  projectId: string,
  question: string
): Promise<boolean> => {
  console.log(`Saving to public form configuration for project ${projectId}: "${question}"`);
  
  try {
    const success = await saveActivityResponse(
      projectId,
      'collection',
      'public-form',
      'story-question',
      { storyQuestion: question }
    );
    
    return success;
  } catch (error) {
    console.error(`Error saving to public form configuration: ${error}`);
    return false;
  }
};

/**
 * Saves a story question to the consolidated activity_responses
 */
export const saveToActivityResponses = async (
  projectId: string,
  question: string
): Promise<boolean> => {
  console.log(`Saving to consolidated activity_responses for project ${projectId}: "${question}"`);
  
  try {
    const success = await saveActivityResponse(
      projectId,
      'collection',
      'story-questions',
      'story-questions',
      { 
        question,
        selected_at: new Date().toISOString()
      }
    );
    
    return success;
  } catch (error) {
    console.error(`Error saving to activity_responses: ${error}`);
    return false;
  }
};
