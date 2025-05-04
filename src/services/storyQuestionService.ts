
import { STORAGE_KEYS } from './constants/storageKeys';
import { getStorageItem, setStorageItem, markFormAsDesigned } from './utils/storageUtils';

// Default story question to use when nothing is saved and we explicitly need a fallback
export const DEFAULT_STORY_QUESTION = "";

// Get the saved story question - always returns a string or null for new projects
export const getStoryQuestion = (projectId?: string): string | null => {
  // First try to get project-specific question if a projectId is provided
  if (projectId) {
    const projectKey = `${STORAGE_KEYS.STORY_QUESTION}_${projectId}`;
    const projectSavedData = getStorageItem<{ question: string } | null>(projectKey, null);
    
    if (projectSavedData && projectSavedData.question) {
      console.log(`Successfully retrieved story question for project ${projectId}:`, projectSavedData.question);
      return projectSavedData.question;
    }
  }
  
  // Fallback to global question
  const savedData = getStorageItem<{ question: string } | null>(STORAGE_KEYS.STORY_QUESTION, null);
  
  if (savedData && savedData.question) {
    console.log("Successfully retrieved global story question:", savedData.question);
    return savedData.question;
  }
  
  // Check if we've marked this project as having saved a question before
  if (projectId) {
    const hasQuestionBeenSaved = localStorage.getItem(`culturesprint_story_question_saved_${projectId}`);
    if (hasQuestionBeenSaved === 'true') {
      // If we've saved before but now have no question, return empty string
      return "";
    }
  }
  
  console.log("No story question found in localStorage, returning null for new project");
  return null; // Return null for new projects instead of default
};

// Helper function to store the story question
export const saveStoryQuestion = (question: string, projectId?: string): void => {
  // Always save to the global key for backward compatibility
  setStorageItem(STORAGE_KEYS.STORY_QUESTION, { question });
  
  // If a projectId is provided, also save to a project-specific key
  if (projectId) {
    const projectKey = `${STORAGE_KEYS.STORY_QUESTION}_${projectId}`;
    setStorageItem(projectKey, { question });
  }
  
  // Use projectId if provided, otherwise use empty string
  markFormAsDesigned(projectId || '');
  
  // Set the saved flag for this project
  if (projectId) {
    localStorage.setItem(`culturesprint_story_question_saved_${projectId}`, 'true');
  }
  
  console.log("Saved story question:", question, "for project:", projectId || 'global');
};
