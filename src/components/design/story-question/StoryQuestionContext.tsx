
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useStoryQuestion } from "@/hooks/story-question";

interface StoryQuestionContextProps {
  projectId: string;
  response: string;
  setResponse: (response: string) => void;
  savedQuestion: string | null;
  currentQuestion: string | null;
  isLoading: boolean;
  isEditing: boolean;
  hasEverSavedQuestion: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSaveQuestion: (question: string) => Promise<void>;
}

const StoryQuestionContext = createContext<StoryQuestionContextProps | undefined>(undefined);

interface StoryQuestionProviderProps {
  children: ReactNode;
  projectId: string;
  projectContext?: string;
}

export const StoryQuestionProvider: React.FC<StoryQuestionProviderProps> = ({ 
  children, 
  projectId,
  projectContext
}) => {
  const [response, setResponse] = useState("");
  
  const {
    savedQuestion,
    currentQuestion,
    isLoading,
    isEditing,
    hasEverSavedQuestion,
    setIsEditing,
    handleSaveQuestion: originalSaveQuestion
  } = useStoryQuestion(projectId);

  // Wrap the original save function to convert Promise<boolean> to Promise<void>
  const handleSaveQuestion = async (question: string): Promise<void> => {
    await originalSaveQuestion(question);
    // We don't need to return the boolean value
  };

  return (
    <StoryQuestionContext.Provider value={{
      projectId,
      response,
      setResponse,
      savedQuestion,
      currentQuestion,
      isLoading,
      isEditing,
      hasEverSavedQuestion,
      setIsEditing,
      handleSaveQuestion
    }}>
      {children}
    </StoryQuestionContext.Provider>
  );
};

export const useStoryQuestionContext = () => {
  const context = useContext(StoryQuestionContext);
  if (context === undefined) {
    throw new Error("useStoryQuestionContext must be used within a StoryQuestionProvider");
  }
  return context;
};
