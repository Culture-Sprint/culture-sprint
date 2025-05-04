
import { useStoryQuestionState } from './useStoryQuestionState';
import { useStoryQuestionFetching } from './useStoryQuestionFetching';
import { useStoryQuestionActions } from './useStoryQuestionActions';

export const useStoryQuestion = (projectId: string) => {
  // Initialize the state
  const {
    savedQuestion,
    setSavedQuestion,
    currentQuestion,
    setCurrentQuestion,
    isLoading,
    setIsLoading,
    hasEverSavedQuestion,
    setHasEverSavedQuestion,
    isEditing,
    setIsEditing
  } = useStoryQuestionState(projectId);

  // Set up data fetching
  useStoryQuestionFetching({
    projectId,
    savedQuestion,
    setSavedQuestion,
    setCurrentQuestion,
    setIsLoading,
    setHasEverSavedQuestion,
    isEditing
  });

  // Set up actions (save, edit)
  const { handleSaveQuestion, handleEditQuestion } = useStoryQuestionActions({
    projectId,
    savedQuestion,
    setSavedQuestion,
    setCurrentQuestion,
    setIsEditing,
    setHasEverSavedQuestion
  });

  return {
    // State
    savedQuestion,
    currentQuestion,
    isLoading,
    isEditing,
    hasEverSavedQuestion,
    
    // Setters
    setIsEditing,
    setSavedQuestion,
    setCurrentQuestion,
    
    // Actions
    handleSaveQuestion,
    handleEditQuestion
  };
};
