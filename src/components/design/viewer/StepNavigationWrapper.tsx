
import React from "react";
import StepNavigation from "../StepNavigation";
import { DesignStep } from "@/data/types/designTypes";

interface StepNavigationWrapperProps {
  steps: DesignStep[];
  currentStep: string;
  onStepChange: (stepId: string) => void;
  phaseId: string;
}

const StepNavigationWrapper: React.FC<StepNavigationWrapperProps> = ({
  steps,
  currentStep,
  onStepChange,
  phaseId,
}) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <StepNavigation 
        steps={steps} 
        currentStep={currentStep} 
        onStepChange={onStepChange}
        phaseId={phaseId}
      />
    </div>
  );
};

export default StepNavigationWrapper;
