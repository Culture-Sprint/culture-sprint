
import { useState, useEffect } from "react";
import { getStoryQuestion, saveStoryQuestion } from "@/services/storyQuestionService";

export const useStoryQuestion = (projectId: string) => {
  const [savedQuestion, setSavedQuestion] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [hasEverSavedQuestion, setHasEverSavedQuestion] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("useStoryQuestion hook called with projectId:", projectId);
    const fetchStoryQuestion = async () => {
      if (!projectId) {
        console.log("No projectId provided to useStoryQuestion, skipping fetch");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching story question for project:", projectId);
        const question = await getStoryQuestion(projectId);
        
        console.log("Story question fetch result:", question);
        setSavedQuestion(question);
        setCurrentQuestion(question);
        setHasEverSavedQuestion(!!question);
        
      } catch (err) {
        console.error("Error fetching story question:", err);
        setError("Failed to load the story question");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoryQuestion();
  }, [projectId]);

  const handleSaveQuestion = async (question: string): Promise<boolean> => {
    if (!projectId) {
      console.error("Cannot save question: No project ID provided");
      return false;
    }

    try {
      console.log("Saving story question for project:", projectId);
      await saveStoryQuestion(question, projectId);
      
      // Update state after successful save
      setSavedQuestion(question);
      setCurrentQuestion(question);
      setHasEverSavedQuestion(true);
      
      return true;
    } catch (err) {
      console.error("Error saving story question:", err);
      return false;
    }
  };

  return {
    savedQuestion,
    currentQuestion,
    isLoading,
    isEditing,
    hasEverSavedQuestion,
    error,
    setIsEditing,
    handleSaveQuestion
  };
};
