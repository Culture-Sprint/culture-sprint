
import { useState, useEffect } from "react";
import { processAIResponse } from "../../improver/questionUtils";
import { handleError } from "@/utils/errorHandling";

export const useResponseProcessing = (
  response: string,
  currentQuestion: string | null
) => {
  const [displayQuestion, setDisplayQuestion] = useState<string>('');
  const [questionSaved, setQuestionSaved] = useState(false);
  
  // Update display question when response changes
  useEffect(() => {
    if (response) {
      console.log("[useResponseProcessing] New AI response received:", response);
      try {
        const processedResponse = processAIResponse(response);
        console.log("[useResponseProcessing] Processed response:", processedResponse);
        setDisplayQuestion(processedResponse);
        setQuestionSaved(false);
      } catch (error) {
        handleError(error, "Failed to process the AI response", {
          showToast: false,
          context: { response }
        });
      }
    }
  }, [response]);
  
  // Update from current question if available
  useEffect(() => {
    if (currentQuestion) {
      console.log("[useResponseProcessing] Updating from current question:", currentQuestion);
      try {
        const processedQuestion = processAIResponse(currentQuestion);
        setDisplayQuestion(processedQuestion);
        setQuestionSaved(true);
      } catch (error) {
        handleError(error, "Failed to process the current question", {
          showToast: false,
          context: { currentQuestion }
        });
      }
    }
  }, [currentQuestion]);

  return {
    displayQuestion,
    setDisplayQuestion,
    questionSaved,
    setQuestionSaved
  };
};
