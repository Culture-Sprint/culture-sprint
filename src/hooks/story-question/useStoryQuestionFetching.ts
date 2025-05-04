import { useEffect } from "react";
import { getStoryQuestionWithSync } from "@/services/sync/storyQuestionSyncService";
import { processAIResponse } from "@/components/design/improver/questionUtils";
import { clearFormCache } from "@/hooks/collect/form-fetch/formDataCache";
import { handleError } from "@/utils/errorHandling";

interface StoryQuestionFetchingProps {
  projectId: string;
  savedQuestion: string | null;
  setSavedQuestion: (question: string | null) => void;
  setCurrentQuestion: (question: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setHasEverSavedQuestion: (hasEverSaved: boolean) => void;
  isEditing: boolean;
}

export const useStoryQuestionFetching = ({
  projectId,
  savedQuestion,
  setSavedQuestion,
  setCurrentQuestion,
  setIsLoading,
  setHasEverSavedQuestion,
  isEditing
}: StoryQuestionFetchingProps) => {
  // Load saved question if it exists or if project changes
  useEffect(() => {
    if (!projectId) return;
    
    // Store previous project ID for comparison
    const previousProjectId = localStorage.getItem('story_question_last_project_id');
    
    // Clear cached questions and reset state if switching to a different project
    if (previousProjectId && previousProjectId !== projectId) {
      console.log(`Project changed from ${previousProjectId} to ${projectId}, clearing story question cache`);
      
      // Reset state to ensure blank start
      setSavedQuestion(null);
      setCurrentQuestion(null);
      setHasEverSavedQuestion(false);
      
      // Clear all potential storage locations of story question
      try {
        localStorage.removeItem(`culturesprint_story_question_saved_${previousProjectId}`);
        localStorage.removeItem(`culturesprint_story_question_${previousProjectId}`);
        localStorage.removeItem(`${projectId}_story_question_saved`);
      } catch (e) {
        console.error("Error clearing local storage:", e);
      }
    }
    
    // Update the last project ID
    localStorage.setItem('story_question_last_project_id', projectId);
    
    const fetchSavedQuestion = async () => {
      setIsLoading(true);
      
      // Clear any existing caches for this specific data
      try {
        const cacheKey = `form_data_${projectId}`;
        clearFormCache(cacheKey);
        
        // Clear all potential storage locations of story question with consolidated ID
        sessionStorage.removeItem(`ar_cache_${projectId}_collection_story-questions_story-questions`);
        sessionStorage.removeItem(`ar_cache_${projectId}_collection_public-form_public-story-questions`);
        sessionStorage.removeItem(`ar_cache_${projectId}_design_story-questions_story-questions`);
      } catch (cacheError) {
        console.error("Error clearing cache before fetching story question:", cacheError);
      }
      
      try {
        console.log(`useStoryQuestion: Fetching question for project ${projectId} with force refresh`);
        
        // Always fetch with force refresh to ensure we get the latest data
        const forceRefresh = true;
        
        // Always fetch question for the specific project ID
        const question = await getStoryQuestionWithSync(projectId, forceRefresh);
        
        console.log(`useStoryQuestion: Retrieved question:`, question);
        
        // Process the question to ensure it's valid
        const processedQuestion = processAIResponse(question);
        
        // Only use the question if it's valid after processing
        if (processedQuestion && processedQuestion.trim().length > 3) {
          console.log(`useStoryQuestion: Using valid question:`, processedQuestion);
          setSavedQuestion(processedQuestion);
          setCurrentQuestion(processedQuestion);
          setHasEverSavedQuestion(true);
          
          // Mark this project as having a saved question
          try {
            localStorage.setItem(`culturesprint_story_question_saved_${projectId}`, 'true');
          } catch (storageError) {
            handleError(storageError, `Storage error when saving question flag for project ${projectId}`, {
              showToast: false,
              severity: 'warning'
            });
          }
        } else {
          // Check if we've saved a question before according to localStorage
          const hasQuestionBeenSaved = localStorage.getItem(`culturesprint_story_question_saved_${projectId}`);
          if (hasQuestionBeenSaved === 'true') {
            // For projects with a saved flag but invalid question, 
            // we'll keep the state as saved but with empty question
            console.log(`useStoryQuestion: Project has saved flag but invalid question`);
            setSavedQuestion(null);
            setCurrentQuestion(null);
            setHasEverSavedQuestion(true);
          } else {
            // If we don't have a valid question and no saved status, show generate button
            console.log(`useStoryQuestion: No valid question found for new project, showing generate button`);
            setSavedQuestion(null);
            setCurrentQuestion(null);
            setHasEverSavedQuestion(false);
          }
        }
      } catch (error) {
        handleError(error, `Error loading saved question for project ${projectId}`, {
          context: { projectId },
          showToast: false // Don't show toast for fetch errors on initial load
        });
        
        // For new projects, always show the generate button
        setSavedQuestion(null);
        setCurrentQuestion(null);
        setHasEverSavedQuestion(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedQuestion();
  }, [projectId, setSavedQuestion, setCurrentQuestion, setIsLoading, setHasEverSavedQuestion]);
};
