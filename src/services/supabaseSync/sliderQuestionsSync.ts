
import { fetchActivityResponse, saveActivityResponse, isAuthenticated } from './operations';
import { SliderQuestion } from '../types/designTypes';
import { 
  CANONICAL_SLIDER_LOCATION, 
  PUBLIC_FORM_SLIDER_LOCATION,
  cleanSliderQuestion,
  migrateSliderQuestions
} from './migrations/sliderQuestionsMigration';

// Sync slider questions with Supabase
export const syncSliderQuestionsFromSupabase = async (
  projectId: string,
  localQuestions: SliderQuestion[],
  isTemplateProject: boolean = false
): Promise<SliderQuestion[]> => {
  if (!projectId) {
    return localQuestions.map(cleanSliderQuestion);
  }
  
  console.log(`DEBUG: Attempting to fetch slider questions from Supabase for project: ${projectId}, isTemplate: ${isTemplateProject}`);
  
  try {
    // Check if the user is authenticated
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      console.log("DEBUG: User not authenticated for slider questions, using local questions");
      return localQuestions.map(cleanSliderQuestion);
    }
    
    // First, try to migrate and consolidate data if needed
    const migratedQuestions = await migrateSliderQuestions(projectId);
    if (migratedQuestions.length > 0) {
      console.log(`DEBUG: Using ${migratedQuestions.length} questions from migration`);
      return migratedQuestions;
    }
    
    // Otherwise, fetch from canonical location
    console.log(`DEBUG: Fetching from canonical location: ${CANONICAL_SLIDER_LOCATION.phase}/${CANONICAL_SLIDER_LOCATION.step}/${CANONICAL_SLIDER_LOCATION.activity}`);
    
    const canonicalResponse = await fetchActivityResponse<any>(
      projectId,
      CANONICAL_SLIDER_LOCATION.phase,
      CANONICAL_SLIDER_LOCATION.step,
      CANONICAL_SLIDER_LOCATION.activity,
      null,
      'sliderQuestions',
      isTemplateProject
    );
    
    if (canonicalResponse && Array.isArray(canonicalResponse) && canonicalResponse.length > 0) {
      console.log(`DEBUG: Found ${canonicalResponse.length} questions in canonical location`);
      return canonicalResponse.map(cleanSliderQuestion);
    }
    
    if (canonicalResponse && typeof canonicalResponse === 'object' && 
        canonicalResponse.sliderQuestions && 
        Array.isArray(canonicalResponse.sliderQuestions) && 
        canonicalResponse.sliderQuestions.length > 0) {
      console.log(`DEBUG: Found ${canonicalResponse.sliderQuestions.length} questions in canonical location`);
      return canonicalResponse.sliderQuestions.map(cleanSliderQuestion);
    }
    
    // No data found, return local questions
    console.log("DEBUG: No slider questions found in Supabase, using local questions");
    return localQuestions.map(cleanSliderQuestion);
  } catch (error) {
    console.error("Error in syncSliderQuestionsFromSupabase:", error);
    return localQuestions.map(cleanSliderQuestion);
  }
};

// Save slider questions to Supabase
export const saveSliderQuestionsToSupabase = async (
  projectId: string,
  questions: SliderQuestion[]
): Promise<boolean> => {
  if (!projectId) {
    console.log("No project ID provided, not saving slider questions to Supabase");
    return false;
  }
  
  console.log(`DEBUG: Saving ${questions.length} slider questions to Supabase for project: ${projectId}`);
  
  try {
    // Check if the user is authenticated
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      console.log("DEBUG: User not authenticated, not saving slider questions to Supabase");
      return false;
    }
    
    // Clean the questions before saving
    const cleanedQuestions = questions.map(cleanSliderQuestion);
    
    // Clear any local storage caches to force fresh data on next fetch
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`sliderThemesSaved_${projectId}`);
      localStorage.removeItem('sliderThemesSaved');
      
      // Also clear any sessionStorage caches
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('slider') || key.includes('activity_responses')) {
          sessionStorage.removeItem(key);
        }
      });
    }
    
    // Save to canonical location
    const canonicalResult = await saveActivityResponse<{sliderQuestions: SliderQuestion[]}>(
      projectId,
      CANONICAL_SLIDER_LOCATION.phase,
      CANONICAL_SLIDER_LOCATION.step,
      CANONICAL_SLIDER_LOCATION.activity,
      {sliderQuestions: cleanedQuestions}
    );
    
    // Also save to public form location for future use
    const publicFormResult = await saveActivityResponse<{sliderQuestions: SliderQuestion[]}>(
      projectId,
      PUBLIC_FORM_SLIDER_LOCATION.phase,
      PUBLIC_FORM_SLIDER_LOCATION.step,
      PUBLIC_FORM_SLIDER_LOCATION.activity,
      {sliderQuestions: cleanedQuestions}
    );
    
    console.log("DEBUG: Slider questions save results:", {
      canonicalLocation: canonicalResult,
      publicFormLocation: publicFormResult
    });
    
    // Force trigger events to notify components
    if (canonicalResult || publicFormResult) {
      try {
        // Use events to broadcast the change
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('slider_questions_updated', {
            detail: { projectId, timestamp: Date.now() }
          }));
        }
      } catch (e) {
        console.error("Error dispatching events:", e);
      }
    }
    
    return canonicalResult || publicFormResult;
  } catch (error) {
    console.error("Error in saveSliderQuestionsToSupabase:", error);
    return false;
  }
};
