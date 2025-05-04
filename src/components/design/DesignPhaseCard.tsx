
import React, { useState, useEffect } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { ActivityFormData } from "@/types/activity";
import PhaseNavigation from "./PhaseNavigation";
import { useActivityDataManager } from "./hooks/useActivityDataManager";
import PhaseStepView from "./phase/PhaseStepView";
import ActivityView from "./phase/ActivityView";
import CustomComponentView from "./phase/CustomComponentView";

interface DesignStep {
  id: string;
  title: string;
  description: string;
  component?: React.ReactNode;
  activities: {
    id: string;
    title: string;
    description: string;
  }[];
}

interface DesignPhaseCardProps {
  phaseId: string;
  steps: DesignStep[];
}

const DesignPhaseCard: React.FC<DesignPhaseCardProps> = ({ phaseId, steps }) => {
  const [currentStep, setCurrentStep] = useState(steps[0]?.id || "");
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const { activeProject } = useProject();
  const [lastProjectId, setLastProjectId] = useState<string | undefined>(undefined);

  // Get the current step data
  const currentStepData = steps.find(step => step.id === currentStep);
  if (!currentStepData) return null;

  // Initialize the activity data manager hook
  const { activityData, handleActivitySaved } = useActivityDataManager(
    activeProject?.id,
    phaseId,
    currentStep,
    currentStepData.activities
  );

  // Handle project changes
  useEffect(() => {
    if (activeProject?.id && lastProjectId && activeProject.id !== lastProjectId) {
      console.log(`Project changed from ${lastProjectId} to ${activeProject.id}, clearing activity data`);
      setSelectedActivity(null);
    }
    setLastProjectId(activeProject?.id);
  }, [activeProject?.id, lastProjectId]);

  // Handle step changes
  const handleStepChange = (newStepId: string) => {
    console.log(`Changing step to: ${newStepId} in phase: ${phaseId}`);
    setCurrentStep(newStepId);
  };

  // If the step has a custom component, render that instead
  if (currentStepData.component) {
    return <CustomComponentView component={currentStepData.component} phaseId={phaseId} />;
  }

  // If an activity is selected, render the activity view
  if (selectedActivity) {
    const activity = currentStepData.activities.find(a => a.id === selectedActivity);
    if (!activity) return null;

    return (
      <ActivityView
        phaseId={phaseId}
        stepId={currentStep}
        activity={activity}
        onBackToActivities={() => setSelectedActivity(null)}
        onActivitySaved={handleActivitySaved}
      />
    );
  }

  // Render the step view
  return (
    <PhaseStepView
      currentStep={currentStepData}
      steps={steps}
      phaseId={phaseId}
      activityData={activityData}
      onStartActivity={setSelectedActivity}
      onStepChange={handleStepChange}
    />
  );
};

export default DesignPhaseCard;
