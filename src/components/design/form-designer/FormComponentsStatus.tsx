
import React from "react";
import { Check } from "lucide-react";

interface FormComponentsStatusProps {
  checkResults: {
    hasStoryQuestion: boolean;
    hasSliderQuestions: boolean;
    hasParticipantQuestions: boolean;
  };
}

const FormComponentsStatus: React.FC<FormComponentsStatusProps> = ({ checkResults }) => {
  return (
    <div className="bg-narrafirma-50 p-4 rounded-lg border border-narrafirma-100">
      <h3 className="font-medium text-narrafirma-800 mb-2">Form Components Status</h3>
      <ul className="text-sm space-y-1.5 mb-4">
        <li className="flex items-start">
          <span className={`mr-2 ${checkResults.hasStoryQuestion ? 'text-green-600' : 'text-amber-600'}`}>
            {checkResults.hasStoryQuestion ? '✓' : '!'}
          </span>
          Story question from "Story questions"
        </li>
        <li className="flex items-start">
          <span className="text-green-600 mr-2">
            <Check className="h-4 w-4" />
          </span>
          Title/hashtag field
        </li>
        <li className="flex items-start">
          <span className="text-green-600 mr-2">
            <Check className="h-4 w-4" />
          </span>
          Emotional response selection
        </li>
        <li className="flex items-start">
          <span className={`mr-2 ${checkResults.hasSliderQuestions ? 'text-green-600' : 'text-amber-600'}`}>
            {checkResults.hasSliderQuestions ? '✓' : '?'}
          </span>
          Slider questions for story interpretation
        </li>
        <li className="flex items-start">
          <span className={`mr-2 ${checkResults.hasParticipantQuestions ? 'text-green-600' : 'text-amber-600'}`}>
            {checkResults.hasParticipantQuestions ? '✓' : '?'}
          </span>
          Participant questions you've configured
        </li>
        <li className="flex items-start">
          <span className="text-green-600 mr-2">
            <Check className="h-4 w-4" />
          </span>
          Additional comments field
        </li>
      </ul>
    </div>
  );
};

export default FormComponentsStatus;
