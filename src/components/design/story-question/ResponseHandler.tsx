
import React, { useEffect } from "react";
import { useStoryQuestionContext } from "./StoryQuestionContext";
import { StoryQuestionResponseHandler } from "./StoryQuestionResponseHandler";

interface ResponseHandlerProps {
  updateFromResponse: (processedQuestion: string) => void;
}

const ResponseHandler: React.FC<ResponseHandlerProps> = ({ updateFromResponse }) => {
  const { response } = useStoryQuestionContext();

  if (!response) {
    return null;
  }

  return (
    <StoryQuestionResponseHandler 
      response={response} 
      updateFromResponse={updateFromResponse} 
    />
  );
};

export default ResponseHandler;
