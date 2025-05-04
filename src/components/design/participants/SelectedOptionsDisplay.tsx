
import React from "react";
import { Button } from "@/components/ui/button";
import { Option } from "@/hooks/useParticipantQuestions";
import { MultipleChoiceQuestion } from "@/components/design/multiple-choice/types";
import { Pencil } from "lucide-react";

interface SelectedOptionsDisplayProps {
  selectedOptions: Option[];
  definedQuestions: MultipleChoiceQuestion[];
  onDefineChoices: () => void;
}

const SelectedOptionsDisplay: React.FC<SelectedOptionsDisplayProps> = ({
  selectedOptions,
  definedQuestions,
  onDefineChoices
}) => {
  // Get array of IDs that have defined choices
  const definedQuestionIds = definedQuestions.map(q => q.id);

  return (
    <>
      {selectedOptions.length > 0 && (
        <div className="mt-6 p-4 bg-culturesprint-50 rounded-md border border-culturesprint-100">
          <h3 className="font-medium mb-2">Selected participant information:</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {selectedOptions.map((option) => (
              <li key={option.id} className="flex items-start">
                <span className="ml-1">{option.label}</span>
                {definedQuestionIds.includes(option.id) && (
                  <span className="text-xs text-green-600 ml-2">(choices defined)</span>
                )}
              </li>
            ))}
          </ul>
          
          <Button 
            onClick={onDefineChoices}
            className="mt-4 w-full bg-culturesprint-600 hover:bg-culturesprint-700"
          >
            {definedQuestions.length > 0 ? "Edit Choices" : "Define Multiple Choice Options"}
          </Button>
        </div>
      )}
      
      {definedQuestions.length > 0 && (
        <div className="mt-6 p-4 bg-green-50 rounded-md border border-green-100">
          <h3 className="font-medium mb-2 text-green-800">Questions with choices defined:</h3>
          <div className="space-y-4 mt-4">
            {definedQuestions.map((question) => (
              <div key={question.id} className="bg-white p-3 rounded-md border shadow-sm">
                <h4 className="font-medium mb-1">{question.label}</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-gray-600">
                  {question.choices.map((choice) => (
                    <li key={choice.id}>{choice.label}</li>
                  ))}
                </ul>
              </div>
            ))}
            <Button 
              onClick={onDefineChoices}
              variant="outline" 
              className="mt-2 w-full flex items-center justify-center gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Questions & Choices
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default SelectedOptionsDisplay;
