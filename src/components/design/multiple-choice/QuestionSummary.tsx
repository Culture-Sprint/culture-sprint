
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MultipleChoiceQuestion } from "./types";

interface QuestionSummaryProps {
  questions: MultipleChoiceQuestion[];
  onFinish: () => void;
}

const QuestionSummary: React.FC<QuestionSummaryProps> = ({
  questions,
  onFinish,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Question Choices Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <h3 className="font-medium">{question.label}</h3>
            <div className="bg-gray-50 p-3 rounded-md border">
              <ul className="list-disc list-inside space-y-1">
                {question.choices.map((choice) => (
                  <li key={choice.id}>{choice.label}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        <Button onClick={onFinish} className="w-full">
          Confirm All Questions
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuestionSummary;
