
import React, { useEffect, useState } from "react";
import { usePublicFormDataLoader } from "@/hooks/collect/usePublicFormDataLoader";
import { useFormSubmissionHandler } from "@/hooks/collect/useFormSubmissionHandler";
import FormLoadingState from "@/components/collect/FormLoadingState";
import FormErrorState from "./FormErrorState";
import { StoryData } from "@/hooks/collect/form-submission/types";
import { useUserRole } from "@/hooks/useUserRole";
import { logPublicFormData } from "@/utils/publicFormDebug";
import DebugControls from "./DebugControls";
import DebugPanel from "./DebugPanel";
import DemoLimitMessage from "./DemoLimitMessage";
import FormWrapper from "./FormWrapper";

interface PublicFormContainerProps {
  formId?: string | null;
  projectId?: string | null;
}

const PublicFormContainer: React.FC<PublicFormContainerProps> = ({ formId, projectId }) => {
  const [showDebug, setShowDebug] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isSuperAdmin } = useUserRole();
  const [demoLimitReached, setDemoLimitReached] = useState(false);
  
  // Load form data with the loader for public forms
  const formData = usePublicFormDataLoader(formId, projectId);
  const { handleFormSubmit, isSubmitting } = useFormSubmissionHandler(true, projectId || undefined);
  
  // Add detailed logging for debugging
  useEffect(() => {
    // Log the form data for debugging purposes
    if (formData && !formData.isLoading) {
      logPublicFormData(
        formId,
        projectId,
        formData.resolvedProjectId,
        formData.storyQuestion,
        formData.sliderQuestions,
        formData.participantQuestions,
        "PublicFormContainer"
      );
    }
  }, [formData, formId, projectId]);
  
  // Function to force refreshing the form data
  const handleRefresh = () => {
    console.log("Forcing refresh of public form data");
    setRefreshTrigger(prev => prev + 1);
  };
  
  if (formData.isLoading) {
    return <FormLoadingState />;
  }
  
  if (formData.error) {
    return <FormErrorState error={formData.error} />;
  }
  
  // Create a wrapper for the onSubmit function to adapt the types
  const handleSubmit = async (data: StoryData): Promise<boolean> => {
    // Add the project ID to the data
    const submissionData = {
      ...data,
      projectId: projectId || formData.resolvedProjectId || undefined
    };
    
    // Convert any non-boolean result to boolean
    const result = await handleFormSubmit(submissionData);
    
    // Check if the demo limit was reached
    if (typeof result === 'string' && result === 'demo-limit-reached') {
      setDemoLimitReached(true);
      return false;
    }
    
    return result === true;
  };
  
  // Toggle debug information
  const toggleDebug = () => setShowDebug(!showDebug);
  
  return (
    <div className="w-full mx-auto">
      {/* Debug and refresh controls */}
      <DebugControls 
        toggleDebug={toggleDebug}
        handleRefresh={handleRefresh}
        showDebug={showDebug}
        isSuperAdmin={isSuperAdmin()}
      />
      
      {/* Debug information panel */}
      {showDebug && isSuperAdmin() && (
        <DebugPanel
          formId={formId}
          projectId={projectId}
          resolvedProjectId={formData.resolvedProjectId}
          storyQuestion={formData.storyQuestion}
          sliderQuestions={formData.sliderQuestions}
          participantQuestions={formData.participantQuestions}
          isLoading={formData.isLoading}
          error={formData.error}
        />
      )}
      
      {/* Demo account limit message */}
      <DemoLimitMessage demoLimitReached={demoLimitReached} />
      
      {/* Only show the form if we haven't hit the demo limit */}
      {!demoLimitReached && (
        <FormWrapper
          storyQuestion={formData.storyQuestion}
          sliderQuestions={formData.sliderQuestions}
          participantQuestions={formData.participantQuestions}
          onSubmit={handleSubmit}
          refreshTrigger={refreshTrigger}
          handleRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default PublicFormContainer;
