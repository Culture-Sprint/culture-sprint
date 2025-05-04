
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface QuestionNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  isLastQuestion,
}) => {
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <>
      <div className="flex justify-between pt-4">
        {!isFirstQuestion && (
          <Button
            variant="outline"
            onClick={onPrevious}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
        )}
        
        <Button
          onClick={onNext}
          className={`flex items-center gap-1 ${isFirstQuestion ? "ml-auto" : ""}`}
        >
          {isLastQuestion ? "Review All" : "Next"}
          {isLastQuestion ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-2">
        Question {currentQuestionIndex + 1} of {totalQuestions}
      </div>
    </>
  );
};

export default QuestionNavigation;
