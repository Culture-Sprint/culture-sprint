
import React from "react";
import StoryQuestionActions from "./StoryQuestionActions";
import { useStoryQuestionContext } from "./StoryQuestionContext";

interface ActionsImplementationProps {
  onAcceptImprovement: (question: string, savedToDb?: boolean) => void;
}

const ActionsImplementation: React.FC<ActionsImplementationProps> = ({ onAcceptImprovement }) => {
  const context = useStoryQuestionContext();
  
  // Get the action handlers which access context internally
  const actions = StoryQuestionActions({ 
    handleAcceptImprovement: onAcceptImprovement 
  });

  // Handle improvement acceptance with the utility function
  const handleAcceptImprovement = (question: string, savedToDb?: boolean) => {
    actions.handleAcceptImprovement(question, savedToDb);
  };

  return null; // This is a utility component that provides functionality, not UI
};

export default ActionsImplementation;
