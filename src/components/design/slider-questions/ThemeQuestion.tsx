
import React from "react";
import { Input } from "@/components/ui/input";

interface ThemeQuestionProps {
  question: string;
  isEditing: boolean;
  editedQuestion: string;
  setEditedQuestion: (question: string) => void;
}

const ThemeQuestion: React.FC<ThemeQuestionProps> = ({
  question,
  isEditing,
  editedQuestion,
  setEditedQuestion
}) => {
  if (isEditing) {
    return (
      <Input 
        value={editedQuestion} 
        onChange={(e) => setEditedQuestion(e.target.value)}
        className="text-sm text-gray-700 mb-4"
      />
    );
  }
  
  return <p className="text-sm text-gray-700 mb-4">{question}</p>;
};

export default ThemeQuestion;
