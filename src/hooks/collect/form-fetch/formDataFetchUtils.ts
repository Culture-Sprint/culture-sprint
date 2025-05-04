
import { FormData } from "./formDataTypes";
import { saveToFormCache } from "./formDataCache";
import { getStorageItem } from "@/services/utils/storageUtils";
import { STORAGE_KEYS } from "@/services/constants/storageKeys";
import { getSliderQuestionsWithSync } from "@/services/sync/sliderQuestionsSyncService";
import { getStoryQuestion } from "@/services/storyQuestionService";
import { getParticipantQuestionsWithSync } from "@/services/sync/participantQuestionsSyncService";

/**
 * Fetch form data for a project by combining data from multiple sources
 * @param projectId The ID of the project to fetch data for
 * @returns FormData object with all form fields
 */
export const fetchProjectFormData = async (projectId: string): Promise<FormData> => {
  console.log(`fetchProjectFormData: Loading form data for project ${projectId}`);
  
  try {
    // Start by loading the story question
    const storyQuestion = await getStoryQuestion(projectId);
    console.log(`fetchProjectFormData: Story question loaded for ${projectId}:`, storyQuestion ? "Present" : "Not found");
    
    // Then load the slider questions - directly from the database
    // Pass isTemplateProject=false to ensure we get the actual project data
    console.log(`fetchProjectFormData: Loading slider questions from database for ${projectId}`);
    const sliderQuestions = await getSliderQuestionsWithSync(projectId, false);
    console.log(`fetchProjectFormData: Loaded ${sliderQuestions.length} slider questions for ${projectId}`, 
      sliderQuestions.map(q => ({ id: q.id, question: q.question.substring(0, 30) })));
    
    // Now get participant questions - use the sync version to ensure we get the latest data
    // This ensures we're fetching from Supabase first, and then falling back to localStorage if needed
    console.log(`fetchProjectFormData: Loading participant questions from database for ${projectId}`);
    const participantQuestions = await getParticipantQuestionsWithSync(projectId);
    console.log(`fetchProjectFormData: Loaded ${participantQuestions.length} participant questions for ${projectId}`);
    
    return {
      storyQuestion: storyQuestion || "",
      sliderQuestions,
      participantQuestions,
      isLoading: false
    };
  } catch (error) {
    console.error("Error in fetchProjectFormData:", error);
    return handleFetchError(error);
  }
};

/**
 * Fetch form data from local storage as a fallback
 * @returns FormData object with data from local storage
 */
export const fetchLocalFormData = (): FormData => {
  try {
    // Check if form has been designed
    const formDesigned = getStorageItem<boolean>(STORAGE_KEYS.FORM_DESIGNED, false);
    
    if (!formDesigned) {
      return {
        storyQuestion: "",
        sliderQuestions: [],
        participantQuestions: [],
        isLoading: false
      };
    }
    
    // Get story question from local storage
    const storyQuestion = getStorageItem<string>(STORAGE_KEYS.STORY_QUESTION, "");
    
    // Get slider questions from local storage service
    // Note: The getSliderQuestions function in sliderQuestionsService already handles
    // the different storage locations and formats
    const sliderQuestions = getStorageItem(STORAGE_KEYS.SLIDER_THEMES, []);
    
    // Get participant questions from local storage
    const participantQuestions = getStorageItem(STORAGE_KEYS.PARTICIPANT_QUESTIONS, []);
    
    return {
      storyQuestion,
      sliderQuestions,
      participantQuestions,
      isLoading: false
    };
  } catch (error) {
    console.error("Error fetching local form data:", error);
    return {
      storyQuestion: "",
      sliderQuestions: [],
      participantQuestions: [],
      isLoading: false
    };
  }
};

/**
 * Handle errors that occur during form data fetching
 * @param error The error that occurred
 * @returns Empty form data with isLoading set to false
 */
export const handleFetchError = (error: any): FormData => {
  console.error("Form data fetch error:", error);
  return {
    storyQuestion: "",
    sliderQuestions: [],
    participantQuestions: [],
    isLoading: false
  };
};
