
import { supabase } from "@/integrations/supabase/client";
import { PublicFormData } from "./types";
import { getStoryQuestion, saveStoryQuestion } from "./storyQuestionService";
import { getSliderQuestions, saveSliderQuestions } from "./sliderQuestionsService";
import { getParticipantQuestions, saveParticipantQuestions } from "./participantQuestionsService";

/**
 * Gets the complete form configuration for a public form
 * @param projectId Project ID
 * @returns Public form data
 */
export const getPublicForm = async (projectId: string): Promise<PublicFormData | null> => {
  try {
    console.log(`Fetching public form data for project: ${projectId}`);
    
    // Get all the form components in parallel
    const [storyQuestion, sliderQuestions, participantQuestions] = await Promise.all([
      getStoryQuestion(projectId),
      getSliderQuestions(projectId),
      getParticipantQuestions(projectId)
    ]);
    
    console.log(`Public form data loaded: 
      story question: ${storyQuestion ? 'yes' : 'no'}, 
      slider questions: ${sliderQuestions?.length || 0}, 
      participant questions: ${participantQuestions?.length || 0}`);
    
    // Debug the actual data
    if (sliderQuestions) {
      console.log("First slider question:", sliderQuestions[0]?.question?.substring(0, 30));
    }
    
    if (participantQuestions) {
      console.log("First participant question:", participantQuestions[0]?.label?.substring(0, 30));
    }
    
    return {
      storyQuestion: storyQuestion || "",
      sliderQuestions: sliderQuestions || [],
      participantQuestions: participantQuestions || []
    };
  } catch (error) {
    console.error("Error getting public form:", error);
    return null;
  }
};

/**
 * Saves a public form
 * @param projectId Project ID
 * @param formData Form data
 * @returns Success status
 */
export const savePublicForm = async (projectId: string, formData: PublicFormData): Promise<boolean> => {
  try {
    // Save all form components
    const promises = [];
    
    // Use await to compare the result of getStoryQuestion with formData.storyQuestion
    const existingStoryQuestion = await getStoryQuestion(projectId);
    if (formData.storyQuestion && existingStoryQuestion !== formData.storyQuestion) {
      promises.push(saveStoryQuestion(projectId, formData.storyQuestion));
    }
    
    promises.push(saveSliderQuestions(projectId, formData.sliderQuestions || []));
    promises.push(saveParticipantQuestions(projectId, formData.participantQuestions || []));
    
    await Promise.all(promises);
    
    return true;
  } catch (error) {
    console.error("Error saving public form:", error);
    return false;
  }
};

// Re-export these to ensure consistency
export { getStoryQuestion, saveStoryQuestion } from "./storyQuestionService";
export { getSliderQuestions, saveSliderQuestions } from "./sliderQuestionsService";
export { getParticipantQuestions, saveParticipantQuestions } from "./participantQuestionsService";
