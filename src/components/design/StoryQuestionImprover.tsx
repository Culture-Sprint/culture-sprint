
import React from "react";
import { Sparkles } from "lucide-react";
import { useDesignAssistant } from "@/hooks/useDesignAssistant";
import ImprovementForm from "./improver/ImprovementForm";
import ImprovementResponse from "./improver/ImprovementResponse";
import ImproverError from "./improver/ImproverError";
import { useQuestionImprover } from "./improver/useQuestionImprover";

interface StoryQuestionImproverProps {
  initialQuestion: string;
  onAcceptImprovement?: (improvedQuestion: string, savedToDb?: boolean) => void;
}

const StoryQuestionImprover: React.FC<StoryQuestionImproverProps> = ({ 
  initialQuestion,
  onAcceptImprovement
}) => {
  const {
    improvementPrompt,
    localQuestion,
    acceptLoading,
    handleImprovementPrompt,
    handleAcceptImprovement,
    createImprovedQuestionPrompt,
    setImprovementPrompt
  } = useQuestionImprover({
    initialQuestion,
    onAcceptImprovement
  });
  
  const {
    prompt,
    setPrompt,
    response,
    setResponse,
    loading,
    error,
    handleSubmit
  } = useDesignAssistant({ mode: 'general' });

  // Reset the response when initial question changes
  React.useEffect(() => {
    setResponse("");
  }, [initialQuestion, setResponse]);

  // Function to handle submitting the improvement request
  const submitImprovement = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create an optimized prompt for faster responses
    const fullPrompt = createImprovedQuestionPrompt(localQuestion, improvementPrompt);
    setPrompt(fullPrompt);
    
    // Call the handleSubmit function from useDesignAssistant
    handleSubmit(e);
  };

  // Handle accepting the improved question
  const acceptImprovement = () => {
    handleAcceptImprovement(response);
    setResponse("");
  };

  return (
    <div className="space-y-4 mt-6 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
        <Sparkles className="h-5 w-5 text-amber-500" />
        Improve Your Story Question
      </div>
      
      <p className="text-sm text-gray-600">
        Want to improve this question? Provide a brief instruction like "make it more engaging" 
        or "focus on emotional aspects".
      </p>
      
      <ImprovementForm
        improvementPrompt={improvementPrompt}
        onImprovementPromptChange={handleImprovementPrompt}
        onSubmit={submitImprovement}
        loading={loading}
      />
      
      {loading && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
          <p className="font-medium">Improving your question...</p>
          <p>We're using AI to enhance your question. Please wait a moment.</p>
        </div>
      )}
      
      <ImprovementResponse 
        response={response} 
        onAccept={acceptImprovement}
        loading={acceptLoading}
      />
      
      <ImproverError error={error} />
    </div>
  );
};

export default StoryQuestionImprover;
