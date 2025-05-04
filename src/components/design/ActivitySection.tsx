
import React from "react";
import ActivityFieldRenderer from "./ActivityFieldRenderer";
import { getFieldsForActivity } from "./utils/fields";
import { DesignActivity } from "@/data/designPhases";

interface ActivitySectionProps {
  activity: DesignActivity;
  formData: {
    [fieldId: string]: string;
  };
  onChange: (fieldId: string, value: string) => void;
  stepId: string;
}

const ActivitySection: React.FC<ActivitySectionProps> = ({
  activity,
  formData,
  onChange,
  stepId,
}) => {
  // Use the consolidated utility function directly
  const fields = getFieldsForActivity("define", stepId, activity.id);
  
  return (
    <div className="space-y-4 bg-white p-4 rounded-md border border-gray-100 shadow-sm">
      <h3 className="text-lg font-semibold text-culturesprint-700 flex items-center gap-2">
        <div className="w-1 h-4 bg-culturesprint-600 rounded-full"></div>
        {activity.title}
      </h3>
      <p className="text-gray-600 mb-4">{activity.description}</p>
      
      {fields.map((field) => (
        <ActivityFieldRenderer
          key={field.id}
          field={field}
          value={formData[field.id] || ""}
          onChange={(value) => onChange(field.id, value)}
          activityId={activity.id}
        />
      ))}
    </div>
  );
};

export default ActivitySection;
