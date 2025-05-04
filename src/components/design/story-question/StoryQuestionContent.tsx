import React from "react";
import { useStoryQuestionContext } from "./StoryQuestionContext";
import { StoryQuestionState } from "./StoryQuestionState";
import ResponseHandler from "./ResponseHandler";
import LocalStorageManager from "./LocalStorageManager";
import { clearFormCache } from "@/hooks/collect/form-fetch/formDataCache";
import { toast } from "@/components/ui/use-toast";

interface StoryQuestionContentProps {
  projectContext: string;
}

const StoryQuestionContent: React.FC<StoryQuestionContentProps> = ({ projectContext }) => {
  const {
    response,
    setResponse,
    savedQuestion,
    currentQuestion,
    isLoading,
    isEditing,
    hasEverSavedQuestion,
    setIsEditing,
    handleSaveQuestion,
    projectId
  } = useStoryQuestionContext();

  // Process response utility
  const updateFromResponse = (processedQuestion: string) => {
    console.log("Processed question from AI response:", processedQuestion);
  };

  // Handle accepting the AI-generated or improved question
  const handleAcceptImprovement = (newQuestion: string, savedToDb?: boolean) => {
    if (savedToDb) {
      // If already saved to DB, update the UI state and show confirmation
      setIsEditing(false);
      toast({
        title: "Question Saved",
        description: "The improved question has been saved as your story question.",
      });
      
      // Clear the cache to ensure the new question is used everywhere
      if (projectId) {
        const cacheKey = `form_data_${projectId}`;
        clearFormCache(cacheKey);
      }
    } else {
      // Otherwise, save the improved question to the database
      handleSaveQuestion(newQuestion)
        .then(() => {
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Error saving improved question:", error);
        });
    }
  };

  return (
    <div className="space-y-4">
      {/* Local storage effect */}
      <LocalStorageManager />

      {/* Process the AI response if present */}
      <ResponseHandler updateFromResponse={updateFromResponse} />

      {/* Main component to handle all states */}
      <StoryQuestionState
        savedQuestion={savedQuestion}
        currentQuestion={currentQuestion}
        loading={isLoading}
        error={null}
        response={response}
        isEditing={isEditing}
        hasEverSavedQuestion={hasEverSavedQuestion}
        projectId={projectId}
        setResponse={setResponse}
        setIsEditing={setIsEditing}
        handleSaveQuestion={handleSaveQuestion}
        handleAcceptImprovement={handleAcceptImprovement}
        projectContext={projectContext}
      />
    </div>
  );
};

export default StoryQuestionContent;
