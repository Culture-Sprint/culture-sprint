
import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import ActivityStatusIcon from "./ActivityStatusIcon";
import ActivityTitle from "./ActivityTitle";
import { ActivityFormData } from "@/types/activity";
import { DesignActivity } from "@/data/types/designTypes";

interface ActivityItemProps {
  id?: string;
  title?: string;
  description?: string;
  status?: "complete" | "incomplete" | "in_progress" | "error";
  path?: string;
  tooltipKey?: string;
  isActive?: boolean;
  summary?: React.ReactNode;
  onClick?: () => void;
  // Props from ActivityList component
  activity?: DesignActivity;
  activityData?: ActivityFormData;
  onStartActivity?: (activityId: string) => void;
  isTemplateProject?: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  id,
  title,
  description,
  status = "incomplete",
  path,
  tooltipKey,
  isActive = false,
  summary,
  onClick,
  // Handle both direct props and props from ActivityList
  activity,
  activityData,
  onStartActivity,
  isTemplateProject = false
}) => {
  const navigate = useNavigate();
  
  // Extract id and title from activity if provided
  const activityId = id || (activity?.id);
  const activityTitle = title || (activity?.title);
  const activityDescription = description || (activity?.description);
  
  // Special handling for form-appearance-editor to always navigate to the full UI
  // This prevents showing the list view
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (onStartActivity && activityId) {
      onStartActivity(activityId);
    } else if (path) {
      // If it's the form appearance editor, force loading the full UI instead of summary view
      if (activityId === "form-appearance-editor" || activityId === "form-appearance") {
        navigate(`/design?phase=build&step=form-appearance&activity=form-appearance-editor`);
      } else {
        navigate(path);
      }
    }
  };

  if (!activityId || !activityTitle) {
    return null;
  }

  // Check if this is a story question activity
  const isStoryQuestionActivity = activityId === "story-questions";

  return (
    <div
      className={`p-4 border rounded-lg transition-all cursor-pointer ${
        isActive ? "border-brand-primary bg-brand-background" : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={handleClick}
      data-testid={`activity-item-${activityId}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-grow">
          <ActivityStatusIcon status={status} size={16} />
          
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <ActivityTitle 
                title={activityTitle} 
                isStoryQuestionActivity={isStoryQuestionActivity}
              />
              {tooltipKey && (
                <InfoTooltip contentKey={tooltipKey} />
              )}
            </div>
            
            {activityDescription && (
              <p className="text-sm text-gray-600 mt-1">{activityDescription}</p>
            )}
            
            {/* If it's the form appearance, don't show the summary view here */}
            {summary && activityId !== "form-appearance-editor" && activityId !== "form-appearance" && (
              <div className="mt-3 text-sm">{summary}</div>
            )}
          </div>
        </div>
        
        <ChevronRight size={16} className="text-gray-400 mt-1" />
      </div>
    </div>
  );
};

export default ActivityItem;
