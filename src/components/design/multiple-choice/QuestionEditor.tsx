
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MultipleChoiceQuestion } from "./types";
import ChoiceList from "./ChoiceList";
import AddChoiceForm from "./AddChoiceForm";
import QuestionNavigation from "./QuestionNavigation";

interface QuestionEditorProps {
  currentQuestion: MultipleChoiceQuestion;
  currentQuestionIndex: number;
  totalQuestions: number;
  newChoice: string;
  onNewChoiceChange: (value: string) => void;
  onAddChoice: () => void;
  onRemoveChoice: (choiceId: string) => void;
  onEditChoice: (choiceId: string, newLabel: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  isLastQuestion: boolean;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  newChoice,
  onNewChoiceChange,
  onAddChoice,
  onRemoveChoice,
  onEditChoice,
  onPrevious,
  onNext,
  isLastQuestion,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Define Choices for: {currentQuestion.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Add multiple choice options for this question. Participants will select one of these options when answering.
        </p>
        
        <div className="space-y-1">
          <p className="text-sm font-medium">Current choices:</p>
          <ChoiceList 
            choices={currentQuestion.choices}
            onRemoveChoice={onRemoveChoice}
            onEditChoice={onEditChoice}
          />
        </div>

        <AddChoiceForm 
          newChoice={newChoice} 
          onNewChoiceChange={onNewChoiceChange}
          onAddChoice={onAddChoice}
        />

        <QuestionNavigation 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          onPrevious={onPrevious}
          onNext={onNext}
          isLastQuestion={isLastQuestion}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionEditor;
