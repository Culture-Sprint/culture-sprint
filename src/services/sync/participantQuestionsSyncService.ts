
import { ParticipantQuestion } from '../types/designTypes';
import { getParticipantQuestions, saveParticipantQuestions } from '../participantQuestionsService';
import { 
  syncParticipantQuestionsFromSupabase as fetchFromSupabase, 
  saveParticipantQuestionsToSupabase as saveToSupabase 
} from '../supabaseSync/participantQuestionsSync';

/**
 * Gets participant questions with Supabase integration
 */
export const getParticipantQuestionsWithSync = async (projectId?: string): Promise<ParticipantQuestion[]> => {
  // Get the local questions specific to this project
  const localQuestions = getParticipantQuestions(projectId);
  
  if (!projectId) {
    console.log("No project ID provided, using local participant questions");
    return localQuestions;
  }
  
  console.log("Fetching participant questions for project ID:", projectId);
  
  try {
    // Always try to get questions from Supabase first
    console.log("Attempting to fetch participant questions from Supabase for project:", projectId);
    const supabaseQuestions = await fetchFromSupabase(projectId, localQuestions);
    
    // If Supabase returned valid questions, use those
    if (supabaseQuestions && Array.isArray(supabaseQuestions) && supabaseQuestions.length > 0) {
      console.log("Found participant questions in Supabase:", supabaseQuestions);
      
      // Save to local storage to ensure consistency, with the project ID
      saveParticipantQuestions(supabaseQuestions, projectId);
      
      return supabaseQuestions;
    }
    
    // If nothing found in Supabase but we have local questions, synchronize them
    if (localQuestions && localQuestions.length > 0) {
      console.log("Syncing local participant questions to Supabase:", localQuestions);
      await saveToSupabase(projectId, localQuestions);
      return localQuestions;
    } else {
      console.log("No participant questions found in Supabase or locally");
    }
    
    return localQuestions;
  } catch (error) {
    console.error("Error fetching participant questions:", error);
    // Return local questions as fallback if there's an error
    return localQuestions;
  }
};

/**
 * Saves participant questions with Supabase integration
 */
export const saveParticipantQuestionsWithSync = async (projectId: string, questions: ParticipantQuestion[]): Promise<boolean> => {
  console.log("Saving participant questions with sync. Project ID:", projectId, "Questions:", questions);
  
  // Always save locally first, with the project ID
  saveParticipantQuestions(questions, projectId);
  
  try {
    // Then save to Supabase
    const success = await saveToSupabase(projectId, questions);
    console.log("Saved participant questions to Supabase:", success);
    return success;
  } catch (error) {
    console.error("Error saving participant questions to Supabase:", error);
    return false;
  }
};
