
import { useState, useCallback } from 'react';
import { SliderQuestion } from '@/services/types/designTypes';

type FetchFn = () => Promise<SliderQuestion[]>;
type SetQuestionsFn = (questions: SliderQuestion[]) => void;
type SetSavedFn = (saved: boolean) => void;
type SetLoadingFn = (loading: boolean) => void;

export const useSliderQuestionRefresh = (
  projectId: string,
  fetchQuestions: FetchFn,
  setQuestions: SetQuestionsFn,
  setSaved: SetSavedFn,
  setLoading: SetLoadingFn
) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshThemes = useCallback(async () => {
    if (!projectId) return;
    
    setIsRefreshing(true);
    setLoading(true);
    
    console.log("Refreshing slider questions for project:", projectId);
    
    try {
      // Clear all flags and caches related to slider questions
      localStorage.removeItem(`sliderThemesSaved_${projectId}`);
      localStorage.removeItem('sliderThemesSaved');
      
      // Clear any related session storage keys
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes('slider') || key.includes('ar_cache')) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Fetch fresh data
      const freshQuestions = await fetchQuestions();
      
      if (freshQuestions && freshQuestions.length > 0) {
        console.log("Refresh successful, found", freshQuestions.length, "questions");
        setQuestions(freshQuestions);
        setSaved(true);
        localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
      } else {
        console.log("Refresh returned no questions");
        setQuestions([]);
        setSaved(false);
      }
    } catch (error) {
      console.error("Error refreshing slider questions:", error);
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, [projectId, fetchQuestions, setQuestions, setSaved, setLoading]);

  return {
    isRefreshing,
    handleRefreshThemes
  };
};
