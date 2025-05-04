
import { useState, useEffect } from "react";

export const useStoryQuestionState = (projectId: string) => {
  const [savedQuestion, setSavedQuestion] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasEverSavedQuestion, setHasEverSavedQuestion] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Check localStorage for the saved question flag on initial render
  useEffect(() => {
    if (projectId) {
      const hasQuestionBeenSaved = localStorage.getItem(`culturesprint_story_question_saved_${projectId}`);
      if (hasQuestionBeenSaved === 'true') {
        setHasEverSavedQuestion(true);
      }
    }
  }, [projectId]);

  return {
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
  };
};
