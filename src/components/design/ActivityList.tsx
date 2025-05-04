import React, { useMemo } from "react";
import { Accordion } from "@/components/ui/accordion";
import ActivityItem from "./ActivityItem";
import { ActivityFormData, findFirstIncompleteActivity } from "@/types/activity";
import { DesignActivity } from "@/data/types/designTypes";

interface ActivityListProps {
  activities: DesignActivity[];
  activityData: {[key: string]: ActivityFormData};
  onStartActivity: (activityId: string) => void;
  isTemplateProject?: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  activities, 
  activityData, 
  onStartActivity,
  isTemplateProject = false
}) => {
  // Find the first incomplete activity using our utility function
  const firstIncompleteActivity = useMemo(() => {
    return findFirstIncompleteActivity(activities, activityData);
  }, [activities, activityData]);

  // Default value: if there's an incomplete activity, open it; otherwise keep all collapsed
  const defaultOpenValue = firstIncompleteActivity ? firstIncompleteActivity.id : undefined;
  
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpenValue}>
      {activities.map(activity => (
        <ActivityItem 
          key={activity.id}
          activity={activity}
          activityData={activityData[activity.id]}
          onStartActivity={onStartActivity}
          isTemplateProject={isTemplateProject}
          status={activityData[activity.id] && Object.keys(activityData[activity.id]).length > 0 
            ? "complete" 
            : "incomplete"}
        />
      ))}
    </Accordion>
  );
};

export default ActivityList;
