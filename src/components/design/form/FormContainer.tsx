
import React, { useEffect, useState } from "react";
import { ActivityFormData } from "@/types/activity";
import ActivityFormFields from "../ActivityFormFields";
import SaveButton from "../SaveButton";

interface FormContainerProps {
  formData: ActivityFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  phaseId: string;
  stepId: string;
  activityId: string;
  saving: boolean;
  savedSuccessfully: boolean;
  onComplete?: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const FormContainer: React.FC<FormContainerProps> = ({
  formData,
  onInputChange,
  phaseId,
  stepId,
  activityId,
  saving,
  savedSuccessfully,
  onSubmit,
}) => {
  const [localFormData, setLocalFormData] = useState<ActivityFormData>({});
  
  // Update local form data when props change
  useEffect(() => {
    console.log(`FormContainer: Updating local data for ${activityId} with:`, formData);
    setLocalFormData(formData);
  }, [formData, activityId]);
  
  // Track form data changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    onInputChange(e);
  };
  
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ActivityFormFields 
        formData={localFormData}
        onChange={handleChange}
        phaseId={phaseId}
        stepId={stepId}
        activityId={activityId}
      />
      
      <div className="flex justify-end mt-4">
        <SaveButton saving={saving} />
      </div>
    </form>
  );
};

export default FormContainer;
