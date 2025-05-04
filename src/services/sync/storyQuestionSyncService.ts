
import { getStoryQuestion, saveStoryQuestion } from '../storyQuestionService';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { setStorageItem } from '../utils/storageUtils';
import { 
  syncStoryQuestionFromSupabase, 
  saveStoryQuestionToSupabase 
} from '../supabaseSync/storyQuestionSync';

/**
 * Gets a story question with Supabase integration
 */
export const getStoryQuestionWithSync = async (projectId?: string, forceRefresh = false): Promise<string> => {
  if (!projectId) {
    console.log("No project ID provided, using local story question");
    return getStoryQuestion();
  }
  
  console.log("Fetching story question for project ID:", projectId, "Force refresh:", forceRefresh);
  
  try {
    // Always prioritize Supabase data for consistent experience
    const supabaseQuestion = await syncStoryQuestionFromSupabase(projectId, getStoryQuestion(), forceRefresh);
    
    // If Supabase returned a valid question, use it
    if (supabaseQuestion && typeof supabaseQuestion === 'string' && supabaseQuestion.trim() !== '') {
      console.log("Found story question in Supabase:", supabaseQuestion);
      
      // Save to local storage to ensure consistency
      saveStoryQuestion(supabaseQuestion, projectId);
      
      return supabaseQuestion;
    }
    
    // If nothing found in Supabase but we have a local question, synchronize it
    const localQuestion = getStoryQuestion();
    if (localQuestion && typeof localQuestion === 'string' && localQuestion.trim() !== '') {
      console.log("Syncing local story question to Supabase:", localQuestion);
      await saveStoryQuestionToSupabase(projectId, localQuestion);
      return localQuestion;
    }
    
    // If all else fails, return the local question (may be default)
    return getStoryQuestion();
  } catch (error) {
    console.error("Error fetching story question:", error);
    return getStoryQuestion();
  }
};

/**
 * Saves a story question with Supabase integration
 */
export const saveStoryQuestionWithSync = async (projectId: string, question: string): Promise<boolean> => {
  if (!projectId) {
    console.warn("No project ID provided for saveStoryQuestionWithSync");
    saveStoryQuestion(question);
    return false;
  }
  
  console.log("Saving story question with sync. Project ID:", projectId, "Question:", question);
  
  // First clear any caches to ensure fresh data
  try {
    sessionStorage.removeItem(`ar_cache_${projectId}_collection_questions_story-questions`);
    sessionStorage.removeItem(`ar_cache_${projectId}_collection_public-form_story-question`);
    sessionStorage.removeItem(`ar_cache_${projectId}_collection_public-form_public-story-questions`);
  } catch (error) {
    console.error("Error clearing cache during save:", error);
  }
  
  // Always save locally first with the specific project ID
  saveStoryQuestion(question, projectId);
  setStorageItem(STORAGE_KEYS.FORM_DESIGNED, 'true');
  
  try {
    // Then save to Supabase
    const success = await saveStoryQuestionToSupabase(projectId, question);
    console.log("Saved story question to Supabase:", success);
    return success;
  } catch (error) {
    console.error("Error saving story question to Supabase:", error);
    return false;
  }
};
