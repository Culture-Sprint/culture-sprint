
import React from "react";
import { ActivityFormData } from "@/types/activity";
import StepContent from "../viewer/StepContent";
import { DesignStep } from "@/data/types/designTypes";

interface PhaseStepViewProps {
  currentStep: DesignStep;
  steps: DesignStep[];
  phaseId: string;
  activityData: {[key: string]: ActivityFormData};
  onStartActivity: (activityId: string) => void;
  onStepChange: (stepId: string) => void;
}

const PhaseStepView: React.FC<PhaseStepViewProps> = ({
  currentStep,
  steps,
  phaseId,
  activityData,
  onStartActivity,
  onStepChange,
}) => {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep.id);
  
  return (
    <div className="space-y-8">
      <StepContent
        currentStep={currentStep}
        steps={steps}
        phaseId={phaseId}
        activityData={activityData}
        onStartActivity={onStartActivity}
        onStepChange={onStepChange}
        currentStepIndex={currentStepIndex}
        totalSteps={steps.length}
      />
    </div>
  );
};

export default PhaseStepView;
