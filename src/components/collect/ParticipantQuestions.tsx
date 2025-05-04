
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ParticipantQuestion } from "@/services/types/designTypes";

interface ParticipantQuestionsProps {
  participantQuestions: ParticipantQuestion[];
  participantAnswers: Record<string, string>;
  onAnswerChange: (id: string, value: string) => void;
}

const ParticipantQuestions: React.FC<ParticipantQuestionsProps> = ({
  participantQuestions,
  participantAnswers,
  onAnswerChange
}) => {
  if (!participantQuestions || participantQuestions.length === 0) return null;

  return (
    <div className="border-t pt-6 mt-8">
      <h3 className="font-medium text-lg mb-6">About You</h3>
      <div className="space-y-8">
        {participantQuestions.map((question) => (
          <div key={question.id} className="mb-2">
            <Label htmlFor={`pq-${question.id}`} className="mb-3 block text-base">{question.label}</Label>
            {question.choices && question.choices.length > 0 ? (
              <RadioGroup 
                id={`pq-${question.id}`} 
                value={participantAnswers[question.id] || ""}
                onValueChange={(value) => onAnswerChange(question.id, value)}
                className="mt-3 space-y-2"
              >
                {question.choices.map((choice) => (
                  <div key={choice.id} className="flex items-center space-x-2">
                    <RadioGroupItem 
                      value={choice.id} 
                      id={`choice-${question.id}-${choice.id}`} 
                    />
                    <Label htmlFor={`choice-${question.id}-${choice.id}`}>
                      {choice.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <Input 
                id={`pq-${question.id}`}
                value={participantAnswers[question.id] || ""}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
                className="mt-2"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantQuestions;
