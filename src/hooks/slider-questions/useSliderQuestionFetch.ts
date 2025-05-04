
import { useCallback, useEffect, useRef } from "react";
import { SliderQuestion } from "@/services/types/designTypes";
import { getSliderQuestionsWithSync } from "@/services/sync/sliderQuestionsSyncService";

export const useSliderQuestionFetch = (projectId: string, isTemplateProject: boolean = false) => {
  let fetchingPromise: Promise<SliderQuestion[]> | null = null;
  const previousProjectIdRef = useRef<string | null>(null);
  
  const isFetching = () => !!fetchingPromise;
  
  // Clear cache when project changes
  useEffect(() => {
    if (!projectId) return;
    
    // Clear cache when switching projects
    if (previousProjectIdRef.current && previousProjectIdRef.current !== projectId) {
      console.log(`Project changed from ${previousProjectIdRef.current} to ${projectId}, clearing slider questions cache`);
      
      try {
        // Clear all slider related cache for previous project
        localStorage.removeItem(`sliderThemesSaved_${previousProjectIdRef.current}`);
        localStorage.removeItem(`culturesprint_slider_themes_${previousProjectIdRef.current}`);
        
        // Clear session storage items
        sessionStorage.removeItem(`ar_cache_${previousProjectIdRef.current}_design_form-questions_slider-questions`);
        sessionStorage.removeItem(`ar_cache_${previousProjectIdRef.current}_collection_form-questions_slider-questions`);
      } catch (e) {
        console.error("Error clearing slider questions cache:", e);
      }
    }
    
    // Update reference
    previousProjectIdRef.current = projectId;
  }, [projectId]);
  
  // Function to fetch slider questions from API
  const fetchSliderQuestions = useCallback(async (): Promise<SliderQuestion[]> => {
    console.log("Fetching slider questions for project:", projectId, "isTemplate:", isTemplateProject);
    
    if (!projectId) {
      console.error("No project ID provided for fetching slider questions");
      return [];
    }
    
    try {
      // Reuse existing promise if one is in flight
      if (fetchingPromise) {
        return fetchingPromise;
      }
      
      // Create a new promise
      fetchingPromise = getSliderQuestionsWithSync(projectId, isTemplateProject).then((data) => {
        const questions = data || [];
        console.log(`Fetched ${questions.length} slider questions from API`);
        return questions;
      });
      
      const result = await fetchingPromise;
      fetchingPromise = null;
      return result;
    } catch (error) {
      console.error("Error fetching slider questions:", error);
      fetchingPromise = null;
      return [];
    }
  }, [projectId, isTemplateProject]);
  
  // Function to refresh themes from API
  const refreshThemes = useCallback(async (): Promise<SliderQuestion[]> => {
    console.log("Refreshing slider questions for project:", projectId, "isTemplate:", isTemplateProject);
    
    // Force a new fetch
    fetchingPromise = null;
    return fetchSliderQuestions();
  }, [fetchSliderQuestions, projectId, isTemplateProject]);
  
  return {
    fetchSliderQuestions,
    refreshThemes,
    isFetching
  };
};
