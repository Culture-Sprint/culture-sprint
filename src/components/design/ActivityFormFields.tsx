
import React from "react";
import { ActivityFormData } from "@/types/activity";
import { getQuestionFields } from "./utils/fields";
import ActivityFieldRenderer from "./ActivityFieldRenderer";

interface ActivityFormFieldsProps {
  formData: ActivityFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { id: string; value: number[] }) => void;
  phaseId: string;
  stepId: string;
  activityId: string;
}

const ActivityFormFields: React.FC<ActivityFormFieldsProps> = ({ 
  formData, 
  onChange, 
  phaseId, 
  stepId, 
  activityId 
}) => {
  // Get the fields for this specific activity
  const fields = getQuestionFields(phaseId, stepId, activityId);
  
  // Debug output to see what fields we're getting
  console.log(`Fields for ${phaseId}/${stepId}/${activityId}:`, fields);
  console.log(`Current form data:`, formData);
  
  // Handle field value change
  const handleFieldChange = (fieldId: string, value: string) => {
    const eventLike = {
      target: {
        name: fieldId,
        value: value
      }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(eventLike);
  };
  
  // If no fields are defined for this activity, show a message
  if (fields.length === 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800">
        <p>No form fields are configured for this activity. Please define them in formFieldUtils.ts</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 bg-white p-4 rounded-md shadow-sm">
      {fields.map((field) => (
        <ActivityFieldRenderer
          key={field.id}
          field={field}
          value={formData[field.id] || ""}
          onChange={(value) => handleFieldChange(field.id, value)}
          activityId={activityId}
        />
      ))}
    </div>
  );
};

export default ActivityFormFields;
