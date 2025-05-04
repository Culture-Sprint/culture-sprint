
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DesignStep } from "@/data/designPhases";

interface StepNavigationProps {
  steps: DesignStep[];
  currentStep: string;
  onStepChange: (stepId: string) => void;
  phaseId: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStep,
  onStepChange,
  phaseId
}) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  const isLastStep = currentIndex === steps.length - 1;
  const isFirstStep = currentIndex === 0;

  // Determine next phase based on current phase
  const getNextPhaseRoute = () => {
    switch (phaseId) {
      case "context":
        return "/design?phase=define";
      case "define":
        return "/design?phase=design";
      case "design":
        return "/design?phase=build";
      case "build":
        return "/collect";
      default:
        return "/design";
    }
  };

  const handleStepChange = (stepId: string) => {
    console.log(`Navigating to step: ${stepId}`);
    if (onStepChange) {
      onStepChange(stepId);
    }
  };

  return (
    <div className="flex justify-between w-full">
      {!isFirstStep && (
        <Button
          variant="outline"
          onClick={() => prevStep && handleStepChange(prevStep.id)}
          disabled={!prevStep}
          className="flex items-center gap-2 border-culturesprint-200 text-culturesprint-700"
        >
          <ChevronLeft className="h-4 w-4" />
          {prevStep ? prevStep.title : "Previous"}
        </Button>
      )}
      
      {isLastStep ? (
        <Button 
          asChild 
          className={`flex items-center gap-2 bg-culturesprint-600 hover:bg-culturesprint-700 text-white ${isFirstStep ? "ml-auto" : ""}`}
        >
          <Link to={getNextPhaseRoute()}>
            Move to Next Phase
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      ) : (
        <Button
          onClick={() => nextStep && handleStepChange(nextStep.id)}
          disabled={!nextStep}
          className={`flex items-center gap-2 bg-culturesprint-600 hover:bg-culturesprint-700 text-white ${isFirstStep ? "ml-auto" : ""}`}
        >
          {nextStep ? nextStep.title : "Next"}
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default StepNavigation;
