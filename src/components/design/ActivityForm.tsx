
import React, { useState, useEffect, useCallback } from "react";
import { useActivityForm } from "@/hooks/useActivityForm";
import FormHeader from "./FormHeader";
import LoadingIndicator from "./LoadingIndicator";
import FormErrorState from "./form/FormErrorState";
import FormContainer from "./form/FormContainer";
import ViewMode from "./form/ViewMode";

interface ActivityFormProps {
  phaseId: string;
  stepId: string;
  activityId: string;
  activityTitle: string;
  activityDescription: string;
  onComplete?: () => void;
  onSaved?: () => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({
  phaseId,
  stepId,
  activityId,
  activityTitle,
  activityDescription,
  onComplete,
  onSaved
}) => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { 
    formData, 
    isLoading, 
    loading, 
    saving, 
    isEditMode,
    savedSuccessfully,
    handleInputChange,
    handleSubmit,
    handleEdit,
    activeProject,
    refreshData
  } = useActivityForm({ 
    phaseId, 
    stepId, 
    activityId,
    onSaved
  });
  
  // Memoized function to refresh data for better performance
  const handleRefresh = useCallback(() => {
    refreshData();
  }, [refreshData]);
  
  // Force refresh data when the refresh key changes
  useEffect(() => {
    if (refreshKey > 0) {
      handleRefresh();
    }
  }, [refreshKey, handleRefresh]);
  
  // Handle successful save
  useEffect(() => {
    if (savedSuccessfully) {
      // Add a short delay to ensure the database has been updated
      const timer = setTimeout(() => {
        setRefreshKey(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [savedSuccessfully]);
  
  if (!activeProject) {
    return <FormErrorState />;
  }
  
  return (
    <div className="space-y-6">
      <FormHeader title={activityTitle} description={activityDescription} />
      
      {(loading || isLoading) ? (
        <LoadingIndicator message="Loading activity data..." />
      ) : isEditMode ? (
        <FormContainer
          formData={formData}
          onInputChange={handleInputChange}
          phaseId={phaseId}
          stepId={stepId}
          activityId={activityId}
          saving={saving}
          savedSuccessfully={savedSuccessfully}
          onComplete={onComplete}
          onSubmit={handleSubmit}
        />
      ) : (
        <ViewMode formData={formData} onEdit={handleEdit} />
      )}
    </div>
  );
};

export default ActivityForm;
