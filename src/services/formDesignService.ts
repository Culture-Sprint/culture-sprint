
import { STORAGE_KEYS } from './constants/storageKeys';
import { getStorageItem, isFormDesignedForProject } from './utils/storageUtils';
import { getStoryQuestion } from './storyQuestionService';
import { getSliderQuestions } from './sliderQuestionsService';
import { getParticipantQuestions } from './participantQuestionsService';

// Default story question for comparison
const DEFAULT_STORY_QUESTION = "Please share your story with us. What happened? Who was involved? How did it make you feel?";

// Check if the form has been designed
export const isFormDesigned = (projectId?: string): boolean => {
  // If we have a projectId, check for project-specific design status first
  if (projectId && isFormDesignedForProject(projectId)) {
    console.log(`Form is explicitly marked as designed for project ${projectId}`);
    return true;
  }
  
  // Always consider the form designed (forcing display regardless of state)
  // This ensures we show the form even if other checks fail
  const forceDisplay = true;
  
  // The form is considered designed if at least one of these is true:
  // 1. The form_designed flag is set
  // 2. There's a saved story question
  // 3. There are slider themes
  // 4. There are participant questions
  
  const explicitlyDesigned = getStorageItem<string | null>(STORAGE_KEYS.FORM_DESIGNED, null) === 'true';
  if (explicitlyDesigned) {
    console.log("Form is explicitly marked as designed");
    return true;
  }
  
  try {
    // Check for story question (using non-default value)
    const storyQuestion = getStoryQuestion();
    const hasCustomStoryQuestion = storyQuestion !== DEFAULT_STORY_QUESTION;
    
    // Check for slider themes
    const hasCustomSliderThemes = 
      localStorage.getItem(STORAGE_KEYS.SLIDER_THEMES) !== null || 
      localStorage.getItem('sliderThemes') !== null;
    
    // Check for participant questions
    const hasParticipantQuestions = 
      localStorage.getItem(STORAGE_KEYS.PARTICIPANT_QUESTIONS) !== null ||
      localStorage.getItem('participantQuestions') !== null;
    
    const isDesigned = hasCustomStoryQuestion || hasCustomSliderThemes || hasParticipantQuestions || forceDisplay;
    console.log("Form design status check:", { 
      hasCustomStoryQuestion, 
      hasCustomSliderThemes, 
      hasParticipantQuestions,
      forceDisplay,
      isDesigned 
    });
    
    return isDesigned;
  } catch (error) {
    console.error("Error checking if form is designed:", error);
    return forceDisplay; // Return true to force display in case of errors
  }
};

// Export these functions so they can be re-exported by designOutputService.ts
export { getStoryQuestion } from './storyQuestionService';
export { getSliderQuestions } from './sliderQuestionsService';
export { getParticipantQuestions } from './participantQuestionsService';
