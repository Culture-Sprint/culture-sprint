
import React, { useState } from "react";
import QuestionDisplay from "./QuestionDisplay";
import QuestionSaveActions from "./QuestionSaveActions";
import { useResponseProcessing } from "./hooks/useResponseProcessing";
import { useToast } from "@/hooks/toast";
import { useErrorHandler } from "@/utils/errorHandling";

interface ResponseContainerProps {
  response: string;
  mode: 'general' | 'storyQuestion';
  onSaveQuestion?: (question: string) => void;
  onAcceptImprovement?: (question: string, savedToDb?: boolean) => void;
  currentQuestion?: string | null;
}

const ResponseContainer: React.FC<ResponseContainerProps> = ({ 
  response, 
  mode,
  onSaveQuestion,
  onAcceptImprovement,
  currentQuestion
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const { toast } = useToast();
  const { wrapHandler } = useErrorHandler("ResponseContainer");
  
  // Use the extracted hook for response processing
  const {
    displayQuestion,
    setDisplayQuestion,
    questionSaved,
    setQuestionSaved
  } = useResponseProcessing(response, currentQuestion);

  const handleSaveManualEdit = wrapHandler((editedQuestion: string) => {
    console.log("[ResponseContainer] Saving manual edit:", editedQuestion);
    setDisplayQuestion(editedQuestion);
    setIsEditMode(false);
    
    // Always save manual edits to the database as the permanent question
    if (onSaveQuestion) {
      console.log("[ResponseContainer] Saving question to database as permanent question:", editedQuestion);
      onSaveQuestion(editedQuestion);
      setQuestionSaved(true);
      
      toast({
        title: "Question saved",
        description: "Your edited question has been saved as the permanent question.",
      });
    }
    
    // Also call onAcceptImprovement to ensure consistent state
    if (onAcceptImprovement) {
      console.log("[ResponseContainer] Accepting improvement with save to DB flag");
      onAcceptImprovement(editedQuestion, true);
    }
  });

  const handleEditClick = () => {
    console.log("[ResponseContainer] Edit mode activated");
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    console.log("[ResponseContainer] Edit cancelled");
    setIsEditMode(false);
  };

  // Better handling for empty questions
  if (!displayQuestion && !response) {
    console.log("[ResponseContainer] No question to display, rendering empty state");
    return null;
  }

  console.log("[ResponseContainer] Render state:", { 
    displayQuestion, 
    questionSaved, 
    isEditMode,
    response,
    currentQuestion
  });

  return (
    <div className="mt-4 space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <QuestionDisplay 
          question={displayQuestion || response} 
          mode={mode} 
          onSave={mode === 'storyQuestion' ? handleSaveManualEdit : undefined}
          saved={questionSaved}
          isEditMode={isEditMode}
          onEditClick={handleEditClick}
          onCancelEdit={handleCancelEdit}
        />
      </div>
      
      <QuestionSaveActions
        mode={mode}
        questionSaved={questionSaved}
        isEditMode={isEditMode}
        displayQuestion={displayQuestion}
        onSave={wrapHandler((question) => {
          // Ensure we're using the correct handler for saving
          handleSaveManualEdit(question);
        })}
      />
    </div>
  );
};

export default ResponseContainer;
