
import React from "react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StepHeaderProps {
  title: string;
  description: string;
  currentStepIndex: number;
  totalSteps: number;
}

const StepHeader: React.FC<StepHeaderProps> = ({
  title,
  description,
  currentStepIndex,
  totalSteps
}) => {
  // Calculate progress percentage
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div className="flex flex-col pb-2 bg-gradient-to-r from-culturesprint-50 to-culturesprint-100 w-full rounded-t-lg p-4">
      <div className="flex-grow mb-4">
        <CardTitle className="text-culturesprint-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      
      <div className="space-y-2">
        <Progress value={progressPercentage} className="h-2 w-full" />
        <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
          <span>Step {currentStepIndex + 1} of {totalSteps}</span>
          <span>{Math.round(progressPercentage)}% complete</span>
        </div>
      </div>
    </div>
  );
};

export default StepHeader;
