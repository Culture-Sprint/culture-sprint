
import { SliderQuestion } from '../types/designTypes';
import { getSliderQuestions, saveSliderQuestions } from '../sliderQuestionsService';
import { 
  syncSliderQuestionsFromSupabase as fetchFromSupabase, 
  saveSliderQuestionsToSupabase as saveToSupabase 
} from '../supabaseSync/sliderQuestionsSync';
import { cleanSliderQuestion } from '../supabaseSync/migrations/sliderQuestionsMigration';

/**
 * Gets slider questions with Supabase integration
 */
export const getSliderQuestionsWithSync = async (
  projectId?: string, 
  isTemplateProject: boolean = false
): Promise<SliderQuestion[]> => {
  const localQuestions = getSliderQuestions();
  
  if (!projectId) {
    console.log("No project ID provided, using local slider questions");
    // Clean local questions before returning
    return localQuestions.map(cleanSliderQuestion);
  }
  
  console.log("Fetching slider questions for project ID:", projectId, "isTemplate:", isTemplateProject);
  
  try {
    // Don't clear local storage flags for template projects
    if (!isTemplateProject) {
      // Clear any project-specific completion flags when loading a project
      localStorage.removeItem(`sliderThemesSaved_${projectId}`);
      localStorage.removeItem('sliderThemesSaved');
    }
    
    // Always prioritize Supabase data for consistent experience, especially for public links
    const supabaseQuestions = await fetchFromSupabase(projectId, localQuestions, isTemplateProject);
    
    // If Supabase returned valid questions, use those
    if (supabaseQuestions && Array.isArray(supabaseQuestions) && supabaseQuestions.length > 0) {
      console.log("Found slider questions in Supabase:", supabaseQuestions);
      
      // Already cleaned in the sync function, but clean again to be sure
      const cleanedQuestions = supabaseQuestions.map(cleanSliderQuestion);
      
      // Save to local storage to ensure consistency
      saveSliderQuestions(cleanedQuestions, projectId);
      
      // Set the saved flag if we found questions
      localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
      localStorage.setItem('sliderThemesSaved', 'true');
      
      return cleanedQuestions;
    }
    
    // If nothing found in Supabase but we have local questions, synchronize them
    if (localQuestions && localQuestions.length > 0) {
      // Clean local questions before syncing
      const cleanedLocalQuestions = localQuestions.map(cleanSliderQuestion);
      
      console.log("Syncing local slider questions to Supabase:", cleanedLocalQuestions);
      await saveToSupabase(projectId, cleanedLocalQuestions);
      
      // Also set this as saved if we synced local questions
      localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
      localStorage.setItem('sliderThemesSaved', 'true');
      
      return cleanedLocalQuestions;
    }
    
    // If we reach here, no questions were found
    localStorage.removeItem(`sliderThemesSaved_${projectId}`);
    localStorage.removeItem('sliderThemesSaved');
    
    return localQuestions.map(cleanSliderQuestion);
  } catch (error) {
    console.error("Error fetching slider questions:", error);
    return localQuestions.map(cleanSliderQuestion);
  }
};

/**
 * Saves slider questions with Supabase integration
 */
export const saveSliderQuestionsWithSync = async (projectId: string, questions: SliderQuestion[]): Promise<boolean> => {
  console.log("Saving slider questions with sync. Project ID:", projectId, "Questions:", questions);
  
  // Clean questions before saving - we use the utility function from the migration module
  const cleanedQuestions = questions.map(cleanSliderQuestion);
  
  // Always save locally first
  saveSliderQuestions(cleanedQuestions, projectId);
  
  try {
    // Then save to Supabase using our updated sync function
    const success = await saveToSupabase(projectId, cleanedQuestions);
    console.log("Saved slider questions to Supabase:", success);
    
    if (success) {
      // Set the saved flag for this project
      localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
      localStorage.setItem('sliderThemesSaved', 'true');
    }
    
    return success;
  } catch (error) {
    console.error("Error saving slider questions to Supabase:", error);
    return false;
  }
};
