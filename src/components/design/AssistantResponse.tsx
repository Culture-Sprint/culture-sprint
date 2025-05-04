
import React from "react";
import ResponseContainer from "./assistantResponse/ResponseContainer";
import { QuestionImprover } from "./improver/QuestionImprover";

interface AssistantResponseProps {
  response: string;
  mode: 'general' | 'storyQuestion';
  onSaveQuestion?: (question: string) => void;
  onAcceptImprovement?: (question: string, savedToDb?: boolean) => void;
  currentQuestion?: string | null;
}

const AssistantResponse: React.FC<AssistantResponseProps> = ({ 
  response, 
  mode,
  onSaveQuestion,
  onAcceptImprovement,
  currentQuestion
}) => {
  console.log("AssistantResponse rendering with:", { 
    responseLength: response.length, 
    mode, 
    hasCurrentQuestion: !!currentQuestion,
    responsePreview: response.substring(0, 50) + "..."
  });

  return (
    <div className="space-y-6">
      <ResponseContainer 
        response={response} 
        mode={mode}
        onSaveQuestion={onSaveQuestion}
        onAcceptImprovement={onAcceptImprovement}
        currentQuestion={currentQuestion}
      />
      
      {mode === 'storyQuestion' && (
        <QuestionImprover 
          initialQuestion={currentQuestion || response} 
          onAcceptImprovement={onAcceptImprovement}
        />
      )}
    </div>
  );
};

export default AssistantResponse;
