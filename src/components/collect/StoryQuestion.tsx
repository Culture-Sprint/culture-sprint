
import React from "react";
import { useLocation } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { processQuestion } from "./story-question/questionUtils";

interface StoryQuestionProps {
  storyQuestion: string | null;
  storyText: string;
  onChange: (value: string) => void;
}

const StoryQuestion: React.FC<StoryQuestionProps> = ({ 
  storyQuestion, 
  storyText, 
  onChange 
}) => {
  const location = useLocation();
  
  // Get the final question to display, using an empty string if no question
  const rawQuestion = storyQuestion || "";
  console.log("StoryQuestion component received raw question:", rawQuestion);
  
  const questionText = processQuestion(rawQuestion);
  console.log("StoryQuestion component processed question:", questionText);
  
  // Determine if this is a public form using React Router's location
  // Check both URL patterns: /submit-story and /public (for compatibility)
  const isPublicForm = location.pathname.includes('submit-story') || 
                     location.pathname.includes('/public');
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      onChange(e.target.value);
    } catch (error) {
      console.error("Error handling textarea change:", error);
    }
  };

  // Display placeholder text to use, with some default instructions if question is empty
  const placeholderText = "Tell us your story...";

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <Label htmlFor="storyText" className="flex items-start gap-1">
          <span className="text-culturesprint-600">
            {questionText || "Your story"} *
          </span>
        </Label>
      </div>
      
      <Textarea 
        id="storyText" 
        value={storyText}
        onChange={handleTextareaChange}
        placeholder={placeholderText}
        className="min-h-[200px]"
      />
    </div>
  );
};

export default StoryQuestion;
