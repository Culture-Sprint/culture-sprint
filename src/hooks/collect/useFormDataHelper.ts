
import { useRef } from "react";
import { FormDataState } from "@/types/formTypes";
import { useFormCache } from "./form-load/useFormCache";
import { useFormDataFetch } from "./form-load/useFormDataFetch";
import { logFormAction } from "./form-load/formLoadingUtils";

/**
 * Contains helper functions for form data loading operations
 */
export const useFormDataHelper = (projectId?: string) => {
  // Get caching utilities
  const { 
    lastLoadedProjectId, 
    shouldLoadFromRemote, 
    loadFromCache, 
    saveToCache, 
    clearCache 
  } = useFormCache(projectId);
  
  // Get fetch utilities
  const { fetchProjectFormData, fetchLocalFormData, handleFetchError } = useFormDataFetch();
  
  /**
   * Load form data from cache
   */
  const loadFormDataFromCache = (setFormData: React.Dispatch<React.SetStateAction<FormDataState>>) => {
    console.group(`[FormDataHelper][${projectId || 'global'}] Loading form data from cache`);
    try {
      console.time(`[FormDataHelper] Cache load operation`);
      const cachedData = loadFromCache<FormDataState | null>(null);
      console.timeEnd(`[FormDataHelper] Cache load operation`);
      
      logFormAction("LoadFromCache", {
        hasCachedData: !!cachedData,
        storyQuestion: cachedData?.storyQuestion?.substring(0, 30),
        sliderCount: cachedData?.sliderQuestions?.length
      });

      if (cachedData) {
        setFormData({
          ...cachedData,
          formDesigned: true,
          isLoading: false
        });
        console.log(`[FormDataHelper] Successfully loaded data from cache: ${cachedData.storyQuestion ? 'has story' : 'no story'}, ${cachedData.sliderQuestions?.length || 0} slider questions`);
        console.groupEnd();
        return true;
      }
      console.log(`[FormDataHelper] No cached data found`);
      console.groupEnd();
      return false;
    } catch (error) {
      logFormAction("CacheLoadError", { projectId: projectId || 'global', error });
      console.error(`[FormDataHelper] Error loading from cache:`, error);
      console.groupEnd();
      return false;
    }
  };

  /**
   * Load form data from remote source
   */
  const loadFormDataFromRemote = async (
    setFormData: React.Dispatch<React.SetStateAction<FormDataState>>,
    isPublic = false
  ): Promise<FormDataState> => {
    console.group(`[FormDataHelper][${projectId || 'global'}] Loading form data from remote`);
    console.time(`[FormDataHelper] Remote load operation`);
    
    logFormAction("LoadFromRemote", {
      projectId,
      isPublic,
      route: window.location.pathname
    });
    
    try {
      let newFormData: FormDataState;
      
      if (projectId) {
        // Clear any cached story question data from sessionStorage
        clearStoryQuestionCache(projectId);
        
        // Use regular fetch for project-specific data
        newFormData = await fetchProjectFormData(projectId);
      } else {
        newFormData = await fetchLocalFormData();
      }
      
      console.timeEnd(`[FormDataHelper] Remote load operation`);
      
      logFormAction("RemoteLoadSuccess", {
        projectId: projectId || 'global',
        storyQuestion: newFormData.storyQuestion?.substring(0, 30) + "...",
        sliderQuestionsCount: newFormData.sliderQuestions?.length || 0,
        participantQuestionsCount: newFormData.participantQuestions?.length || 0
      });
      
      setFormData({
        ...newFormData,
        formDesigned: true,
        isLoading: false
      });
      
      if (!isPublic && projectId) {
        console.log(`[FormDataHelper] Saving form data to cache`);
        saveToCache(newFormData);
        lastLoadedProjectId.current = projectId;
      }
      
      console.groupEnd();
      return newFormData;
    } catch (error) {
      console.timeEnd(`[FormDataHelper] Remote load operation`);
      logFormAction("RemoteLoadError", { projectId: projectId || 'global', error });
      const errorState = handleFetchError(error);
      setFormData({
        ...errorState,
        formDesigned: true,
        isLoading: false
      });
      console.error(`[FormDataHelper] Error loading from remote:`, error);
      console.groupEnd();
      return errorState;
    }
  };

  /**
   * Clear story question related caches
   */
  const clearStoryQuestionCache = (projectId: string) => {
    console.group(`[FormDataHelper][${projectId}] Clearing story question caches`);
    
    const cacheKeys = [
      `ar_cache_${projectId}_collection_questions_story-questions`,
      `ar_cache_${projectId}_collection_public-form_story-question`,
      `ar_cache_${projectId}_collection_public-form_public-story-questions`,
      `ar_cache_${projectId}_design_questions_story-questions`
    ];
    
    cacheKeys.forEach(key => {
      if (sessionStorage.getItem(key)) {
        console.log(`[FormDataHelper] Clearing cache key: ${key}`);
        sessionStorage.removeItem(key);
      }
    });
    
    logFormAction("ClearedStoryQuestionCache", { projectId });
    console.groupEnd();
  };

  /**
   * Force clear all caches related to the current project
   */
  const forceClearAllCaches = () => {
    if (projectId) {
      console.group(`[FormDataHelper][${projectId}] Force clearing all caches`);
      
      // Clear the primary form cache
      clearCache();
      
      // Clear story question-specific caches
      clearStoryQuestionCache(projectId);
      
      logFormAction("ForceClearCaches", { projectId });
      console.groupEnd();
    }
  };

  return {
    loadFormDataFromCache,
    loadFormDataFromRemote,
    shouldLoadDataFromRemote: shouldLoadFromRemote,
    lastLoadedProjectId,
    clearCache,
    forceClearAllCaches,
    fetchProjectFormData,
    fetchLocalFormData,
    handleFetchError
  };
};
