
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { ActivityFormData } from "@/types/activity";

interface ActivityContentProps {
  activityData: ActivityFormData;
  onEdit: () => void;
  hideContent?: boolean; // New prop to control visibility
}

const ActivityContent: React.FC<ActivityContentProps> = ({
  activityData,
  onEdit,
  hideContent = false, // Default to false to maintain existing behavior
}) => {
  if (!activityData || Object.keys(activityData).length === 0 || hideContent) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3 bg-white border border-gray-100 rounded-md p-4">
      {Object.entries(activityData).map(([key, value]) => {
        if (!value || value.trim() === "") return null;
        
        // Format the key for display by capitalizing and replacing underscores with spaces
        const formattedKey = key
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        return (
          <div key={key} className="p-2 bg-gray-50 rounded-md">
            <h4 className="text-sm font-medium text-gray-700">{formattedKey}</h4>
            <p className="text-gray-800 mt-1 whitespace-pre-wrap">{value}</p>
          </div>
        );
      })}
      
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onEdit}
        className="mt-2 text-culturesprint-600 border-culturesprint-200 flex items-center gap-1"
      >
        <Edit size={14} />
        Edit this Activity
      </Button>
    </div>
  );
};

export default ActivityContent;
