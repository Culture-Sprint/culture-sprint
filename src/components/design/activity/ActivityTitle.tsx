
import React from "react";
import { InfoTooltip } from "@/components/ui/info-tooltip";

export interface ActivityTitleProps {
  title: string;
  isStoryQuestionActivity?: boolean;
  className?: string;
}

const ActivityTitle: React.FC<ActivityTitleProps> = ({ 
  title, 
  isStoryQuestionActivity = false,
  className
}) => {
  return (
    <span className={`font-medium text-gray-800 ${className || ''}`}>
      {title}
      {isStoryQuestionActivity && (
        <span className="ml-1 inline-flex items-center">
          <InfoTooltip contentKey="design-story-question" size={14} />
        </span>
      )}
    </span>
  );
};

export default ActivityTitle;
