
/**
 * Utility to clear project context cache and force a fresh fetch
 */
import { clearActivityCache } from "@/services/supabaseSync/core/cacheUtils";
import { generateCacheKey, setCachedResponse } from "@/services/supabaseSync/operations/cache/responseCache";
import { clearProjectStorage } from "@/services/utils/storageUtils";
import { 
  clearProjectContextCache, 
  getOrSetFormattedContextCache 
} from "@/services/cache/projectContextCache";

/**
 * Clears all cached project context data for a specific project
 * @param projectId The project ID to clear context for
 */
export const clearProjectContext = async (projectId: string): Promise<void> => {
  if (!projectId) {
    console.error("Cannot clear project context: No project ID provided");
    return;
  }
  
  console.log(`Clearing all project context cache for project: ${projectId}`);
  
  try {
    // Clear all context-related cache keys
    const contextPhaseActivities = [
      // Context phase
      { phase: 'context', step: 'project-info', activity: 'project-description' },
      { phase: 'context', step: 'organization', activity: 'about' },
      { phase: 'context', step: 'organization', activity: 'history' },
      { phase: 'context', step: 'organization', activity: 'values' },
      { phase: 'context', step: 'project', activity: 'scope' },
      { phase: 'context', step: 'project', activity: 'trigger' },
      { phase: 'context', step: 'project', activity: 'success' },
      
      // Define phase
      { phase: 'define', step: 'discover', activity: 'factors' },
      { phase: 'define', step: 'topic', activity: 'investigate' },
      { phase: 'define', step: 'topic', activity: 'focus' },
      { phase: 'define', step: 'topic', activity: 'actors' },
      { phase: 'define', step: 'discover', activity: 'hopes' },
      { phase: 'define', step: 'discover', activity: 'experiences' },
      
      // Design phase
      { phase: 'design', step: 'story-question', activity: 'story-question-design' },
      { phase: 'design', step: 'form-questions', activity: 'slider-questions' },
      { phase: 'design', step: 'form-questions', activity: 'participant-questions' },
      
      // Story questions specific locations
      { phase: 'collection', step: 'story-questions', activity: 'chosen-question' },
      { phase: 'collection', step: 'public-form', activity: 'story-question' },
      { phase: 'collection', step: 'public-form', activity: 'public-story-questions' },
      
      // Try alternative paths
      { phase: 'planning', step: 'discover', activity: 'factors' },
      { phase: 'planning', step: 'project-planning', activity: 'project-details' },
      { phase: 'context', step: 'project-info', activity: 'about' },
      { phase: 'context', step: 'project-info', activity: 'purpose' },
      { phase: 'context', step: 'org', activity: 'about' },
    ];
    
    // Clear all the cache entries in parallel
    await Promise.all(contextPhaseActivities.map(async ({ phase, step, activity }) => {
      // Clear the activity cache
      await clearActivityCache(projectId, phase, step, activity);
      
      // Also clear the response cache used by fetchActivityResponse
      const cacheKey = generateCacheKey(projectId, phase, step, activity);
      setCachedResponse(cacheKey, null);
      
      console.log(`Cleared cache for ${phase}/${step}/${activity}`);
    }));
    
    // Clear ANY and ALL project context from storage
    try {
      // Clear in-memory cache of getFormattedProjectContext
      clearProjectContextCache(projectId);
      
      // Clear the main project context cache
      sessionStorage.removeItem(`project_context_${projectId}`);
      
      // Clear form data cache for this project
      const formDataCacheKey = `form_data_${projectId}`;
      localStorage.removeItem(formDataCacheKey);
      
      // Clear ALL session storage items containing the project ID
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key && (key.includes(projectId) || key.includes('project_context'))) {
          console.log(`Removing session storage item: ${key}`);
          sessionStorage.removeItem(key);
        }
      }
      
      // Clear design phase specific caches
      localStorage.removeItem(`culturesprint_story_question_saved_${projectId}`);
      localStorage.removeItem(`culturesprint_story_question_${projectId}`);
      localStorage.removeItem(`sliderThemesSaved_${projectId}`);
      localStorage.removeItem(`culturesprint_slider_themes_${projectId}`);
      localStorage.removeItem(`participantQuestionsSaved_${projectId}`);
      localStorage.removeItem(`culturesprint_participant_questions_${projectId}`);
      
      // Also clear the responseCache for this project
      clearActivityResponseCache();
      
      // Additionally clear localStorage project-related items
      clearProjectStorage(projectId);
      
      console.log("Cleared all storage caches for project context");
    } catch (error) {
      console.error("Error clearing storage caches:", error);
    }
    
    console.log("All project context cache cleared successfully");
  } catch (error) {
    console.error("Error clearing project context cache:", error);
  }
};

/**
 * Utility to clear all activity response cache entries
 */
const clearActivityResponseCache = (): void => {
  // Clear all ar_cache_ items in sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key && key.startsWith('ar_cache_')) {
      sessionStorage.removeItem(key);
    }
  }
  console.log('Activity response cache cleared');
};

// Re-export from the new cache service
export { clearProjectContextCache, getOrSetFormattedContextCache };
