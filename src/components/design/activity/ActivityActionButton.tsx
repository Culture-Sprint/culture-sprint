
import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Play } from "lucide-react";
import { ActivityFormData } from "@/types/activity";

interface ActivityActionButtonProps {
  activityId: string;
  activityData?: ActivityFormData;
  onStartActivity: (activityId: string) => void;
}

const ActivityActionButton: React.FC<ActivityActionButtonProps> = ({ 
  activityId, 
  activityData, 
  onStartActivity 
}) => {
  const hasData = activityData && Object.keys(activityData).length > 0;
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={hasData ? 
        "text-culturesprint-600 border-culturesprint-600 flex items-center gap-1" : 
        "text-white bg-culturesprint-600 border-culturesprint-600 hover:bg-culturesprint-700 hover:border-culturesprint-700 flex items-center gap-1"}
      onClick={() => onStartActivity(activityId)}
    >
      {hasData ? (
        <>
          <Pencil size={14} />
          Edit this Activity
        </>
      ) : (
        <>
          <Play size={14} color="white" /> 
          Start this activity
        </>
      )}
    </Button>
  );
};

export default ActivityActionButton;
