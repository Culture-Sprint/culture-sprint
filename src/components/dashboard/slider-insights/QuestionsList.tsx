
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { SliderQuestion } from "../slider-insights/histogramUtils";

interface QuestionsListProps {
  questionList: SliderQuestion[];
  loading: boolean;
  isPublic?: boolean;
  projectId?: string;
}

const QuestionsList = ({ 
  questionList, 
  loading,
  isPublic = false,
  projectId 
}: QuestionsListProps) => {
  // If loading, show skeletons
  if (loading) {
    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Questions in this collection:</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </div>
    );
  }
  
  // If no questions, don't render the component
  if (questionList.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-2">Questions in this collection:</h3>
      <div className="space-y-1">
        {questionList.map((question, index) => (
          <div 
            key={question.id} 
            className="text-sm p-2 bg-culturesprint-50/50 rounded-md"
          >
            <span className="font-medium mr-2">{index + 1}.</span>
            {question.question_text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionsList;
