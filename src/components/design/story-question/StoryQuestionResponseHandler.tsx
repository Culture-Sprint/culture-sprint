
import React, { useEffect } from "react";
import { processAIResponse } from "@/components/design/improver/questionUtils";

interface StoryQuestionResponseHandlerProps {
  response: string;
  updateFromResponse: (question: string) => void;
}

export const StoryQuestionResponseHandler: React.FC<StoryQuestionResponseHandlerProps> = ({
  response,
  updateFromResponse,
}) => {
  useEffect(() => {
    if (response) {
      const processedResponse = processAIResponse(response);
      console.log("Processing AI response in StoryQuestionResponseHandler:", processedResponse);
      updateFromResponse(processedResponse);
    }
  }, [response, updateFromResponse]);

  return null; // This is a utility component with no UI
};
