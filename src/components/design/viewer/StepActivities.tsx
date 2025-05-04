
import React from "react";
import ActivityList from "../ActivityList";
import { ActivityFormData } from "@/types/activity";
import { useTemplateProject } from "@/hooks/projects/useTemplateProject";
import { DesignActivity } from "@/data/types/designTypes";

interface StepActivitiesProps {
  activities: DesignActivity[];
  activityData: {[key: string]: ActivityFormData};
  onStartActivity: (activityId: string) => void;
}

const StepActivities: React.FC<StepActivitiesProps> = ({
  activities,
  activityData,
  onStartActivity,
}) => {
  const projectId = localStorage.getItem('activeProjectId');
  const { isTemplateOrClone } = useTemplateProject();
  const isTemplateProject = projectId ? isTemplateOrClone({ id: projectId } as any) : false;

  return (
    <ActivityList 
      activities={activities}
      activityData={activityData}
      onStartActivity={onStartActivity}
      isTemplateProject={isTemplateProject}
    />
  );
};

export default StepActivities;
