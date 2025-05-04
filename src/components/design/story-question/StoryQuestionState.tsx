
import React from "react";
import StoryQuestionEditor from "../StoryQuestionEditor";
import { useStoryQuestionControls } from "@/hooks/story-question/useStoryQuestionControls";
import SavedQuestionDisplay from "../SavedQuestionDisplay";

interface StoryQuestionStateProps {
  savedQuestion: string | null;
  currentQuestion: string | null;
  loading: boolean;
  error: string | null;
  response: string;
  isEditing: boolean;
  hasEverSavedQuestion: boolean;
  projectId: string;
  setResponse: (response: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  handleSaveQuestion: (question: string) => Promise<void>;
  handleAcceptImprovement: (question: string, savedToDb?: boolean) => void;
  projectContext?: string;
}

export const StoryQuestionState: React.FC<StoryQuestionStateProps> = ({
  savedQuestion,
  currentQuestion,
  loading,
  error,
  response,
  isEditing,
  hasEverSavedQuestion,
  projectId,
  setResponse,
  setIsEditing,
  handleSaveQuestion,
  handleAcceptImprovement,
  projectContext = ''
}) => {
  // Get the controls for generating and editing questions
  const {
    loading: controlsLoading,
    error: controlsError,
    handleGenerateQuestion,
    handleEditQuestionClick
  } = useStoryQuestionControls({
    projectId,
    setResponse,
    setIsEditing,
    projectContext
  });

  // Combine loading states
  const isLoading = loading || controlsLoading;
  
  // Combine error states
  const combinedError = error || controlsError;
  
  // Determine what to display based on state
  const shouldShowEditor = (!hasEverSavedQuestion || isEditing) && (response || currentQuestion);
  
  console.log("StoryQuestionState render:", { 
    savedQuestion, 
    currentQuestion, 
    loading, 
    isEditing, 
    hasEverSavedQuestion,
    shouldShowEditor,
    response: !!response
  });
  
  return (
    <div className="space-y-4">
      {shouldShowEditor && (
        <StoryQuestionEditor
          loading={isLoading}
          error={combinedError}
          response={response}
          hasEverSavedQuestion={hasEverSavedQuestion}
          isEditing={isEditing}
          currentQuestion={currentQuestion}
          onGenerateQuestion={handleGenerateQuestion}
          onSaveQuestion={handleSaveQuestion}
          onAcceptImprovement={handleAcceptImprovement}
        />
      )}
      
      {/* No editor showing, so show generate button or saved question */}
      {!shouldShowEditor && (
        <div>
          {!savedQuestion || hasEverSavedQuestion === false ? (
            // No saved question, show generate button
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
              <h3 className="font-medium text-lg mb-2">No Story Question Yet</h3>
              <p className="text-gray-600 mb-4">
                Generate a story question based on your project context.
              </p>
              <button
                onClick={handleGenerateQuestion}
                className="flex items-center justify-center gap-2 mx-auto px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Generating...</span>
                ) : (
                  <>
                    <span>Generate Question</span>
                  </>
                )}
              </button>
              {combinedError && (
                <p className="mt-4 text-red-600 text-sm">{combinedError}</p>
              )}
            </div>
          ) : (
            // Show saved question with the SavedQuestionDisplay component
            <SavedQuestionDisplay 
              savedQuestion={savedQuestion}
              onEditQuestion={handleEditQuestionClick}
            />
          )}
        </div>
      )}
    </div>
  );
};
