
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ActivityFormData } from "@/types/activity";
import StepHeader from "./StepHeader";
import StepActivities from "./StepActivities";
import StepNavigationWrapper from "./StepNavigationWrapper";
import { DesignStep } from "@/data/types/designTypes";

interface StepContentProps {
  currentStep: DesignStep;
  steps: DesignStep[];
  phaseId: string;
  activityData: {[key: string]: ActivityFormData};
  onStartActivity: (activityId: string) => void;
  onStepChange: (stepId: string) => void;
  currentStepIndex: number;
  totalSteps: number;
}

const StepContent: React.FC<StepContentProps> = ({
  currentStep,
  steps,
  phaseId,
  activityData,
  onStartActivity,
  onStepChange,
  currentStepIndex,
  totalSteps,
}) => {
  return (
    <Card className="border-culturesprint-100 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
        <StepHeader 
          title={currentStep.title}
          description={currentStep.description}
          currentStepIndex={currentStepIndex}
          totalSteps={totalSteps}
        />
      </CardHeader>
      <CardContent className="pt-6">
        <StepActivities 
          activities={currentStep.activities}
          activityData={activityData}
          onStartActivity={onStartActivity}
        />
        
        <StepNavigationWrapper 
          steps={steps}
          currentStep={currentStep.id}
          onStepChange={onStepChange}
          phaseId={phaseId}
        />
      </CardContent>
    </Card>
  );
};

export default StepContent;
