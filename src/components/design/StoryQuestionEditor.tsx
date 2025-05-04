
import React, { useEffect } from "react";
import StoryQuestionGenerator from "./StoryQuestionGenerator";
import AssistantResponse from "./AssistantResponse";

interface StoryQuestionEditorProps {
  loading: boolean;
  error: string | null;
  response: string;
  hasEverSavedQuestion: boolean;
  isEditing: boolean;
  currentQuestion: string | null;
  onGenerateQuestion: (e: React.MouseEvent) => void;
  onSaveQuestion: (question: string) => Promise<void>;
  onAcceptImprovement: (question: string, savedToDb?: boolean) => void;
}

const StoryQuestionEditor: React.FC<StoryQuestionEditorProps> = ({
  loading,
  error,
  response,
  hasEverSavedQuestion,
  isEditing,
  currentQuestion,
  onGenerateQuestion,
  onSaveQuestion,
  onAcceptImprovement
}) => {
  // Determine what to display based on state
  const shouldShowGenerator = (!hasEverSavedQuestion || isEditing) && !response && !currentQuestion;
  const shouldShowResponse = response || currentQuestion;
  
  // Debug logging to track component state
  useEffect(() => {
    console.log("StoryQuestionEditor state:", {
      loading,
      error,
      responseLength: response?.length,
      responsePreview: response?.substring(0, 30),
      currentQuestionLength: currentQuestion?.length,
      currentQuestionPreview: currentQuestion?.substring(0, 30),
      shouldShowGenerator,
      shouldShowResponse,
      hasEverSavedQuestion,
      isEditing
    });
  }, [loading, error, response, currentQuestion, shouldShowGenerator, shouldShowResponse, hasEverSavedQuestion, isEditing]);
  
  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h3 className="text-lg font-semibold">Story Question</h3>
      </div>
      
      {/* Show the StoryQuestionGenerator when we don't have a response or question */}
      {shouldShowGenerator && (
        <StoryQuestionGenerator 
          loading={loading}
          error={error}
          onGenerate={onGenerateQuestion}
        />
      )}
      
      {/* Show the AssistantResponse when we have a response or currentQuestion */}
      {shouldShowResponse && (
        <AssistantResponse 
          response={response || currentQuestion || ''} 
          mode="storyQuestion" 
          onSaveQuestion={onSaveQuestion}
          onAcceptImprovement={onAcceptImprovement}
          currentQuestion={currentQuestion}
        />
      )}
      
      {/* Display error if present */}
      {error && (
        <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 border border-red-100 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default StoryQuestionEditor;
