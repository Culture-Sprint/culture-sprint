
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { aiAssistantService } from "@/services/aiAssistantService";
import { useQuestionImprover } from "./useQuestionImprover";
import ImprovementForm from "./ImprovementForm";
import ImprovementResponse from "./ImprovementResponse";

interface QuestionImproverProps {
  initialQuestion: string;
  onAcceptImprovement: (improvedQuestion: string, savedToDb?: boolean) => void;
}

export const QuestionImprover: React.FC<QuestionImproverProps> = ({
  initialQuestion,
  onAcceptImprovement
}) => {
  const [improvementResponse, setImprovementResponse] = useState("");
  const [isRequesting, setIsRequesting] = useState(false);
  
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
  
  const handleSubmitImprovement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!improvementPrompt.trim()) return;
    
    setIsRequesting(true);
    try {
      // Create the specialized prompt
      const fullPrompt = createImprovedQuestionPrompt(localQuestion, improvementPrompt);
      
      // Call AI service
      const result = await aiAssistantService.callAssistant({
        prompt: fullPrompt,
        mode: 'general' // Changed from 'improve' to 'general'
      });
      
      if (result.error) {
        console.error("Error improving question:", result.error);
        return;
      }
      
      if (result.response) {
        console.log("Improvement response:", result.response);
        setImprovementResponse(result.response);
      }
    } catch (error) {
      console.error("Error requesting improvement:", error);
    } finally {
      setIsRequesting(false);
    }
  };
  
  const handleAcceptClick = () => {
    handleAcceptImprovement(improvementResponse);
    setImprovementResponse("");
    setImprovementPrompt("");
  };
  
  return (
    <Card className="bg-gray-50 border border-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">Improve Your Question</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          How would you like to improve your question?
        </p>
        
        <ImprovementForm 
          improvementPrompt={improvementPrompt}
          onImprovementPromptChange={handleImprovementPrompt}
          onSubmit={handleSubmitImprovement}
          loading={isRequesting}
        />
        
        {improvementResponse && (
          <ImprovementResponse 
            response={improvementResponse} 
            onAccept={handleAcceptClick}
            loading={acceptLoading}
          />
        )}
      </CardContent>
    </Card>
  );
};
