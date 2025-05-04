
import React, { useState, useEffect } from "react";
import { FormProvider } from "@/contexts/form";
import { useUnifiedFormDataLoader } from "@/hooks/collect/useUnifiedFormDataLoader";
import { useFormSubmissionHandler } from "@/hooks/collect/useFormSubmissionHandler";
import FormLoadingState from "@/components/collect/FormLoadingState";
import StoryForm from "@/components/collect/StoryForm";
import FormErrorState from "./FormErrorState";
import { StoryData } from "@/hooks/collect/form-submission/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FormErrorFallback } from "@/components/ui/form-error-fallback";

interface PublicFormContainer2Props {
  formId?: string | null;
  projectId?: string | null;
}

/**
 * Container for public form that uses the new unified form data loader
 * This is a parallel implementation that can be tested while keeping the original one
 */
const PublicFormContainer2: React.FC<PublicFormContainer2Props> = ({ formId, projectId }) => {
  const [showDebug, setShowDebug] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { isSuperAdmin } = useUserRole();
  const [demoLimitReached, setDemoLimitReached] = useState(false);
  
  // Load form data with our new unified loader
  const formData = useUnifiedFormDataLoader(projectId, true);
  const { handleFormSubmit, isSubmitting } = useFormSubmissionHandler(true, projectId || undefined);
  
  // Add detailed logging for debugging
  useEffect(() => {
    console.log("PublicFormContainer2 - Form data loaded:", {
      hasStoryQuestion: !!formData.storyQuestion,
      storyQuestion: formData.storyQuestion?.substring(0, 50),
      sliderQuestionsCount: formData.sliderQuestions?.length || 0,
      participantQuestionsCount: formData.participantQuestions?.length || 0,
      firstSliderQuestion: formData.sliderQuestions && formData.sliderQuestions.length > 0 
        ? formData.sliderQuestions[0].question?.substring(0, 30) 
        : 'none',
      firstParticipantQuestion: formData.participantQuestions && formData.participantQuestions.length > 0
        ? formData.participantQuestions[0].label?.substring(0, 30)
        : 'none',
      isLoading: formData.isLoading,
      refreshTrigger
    });
  }, [formData, refreshTrigger]);
  
  // Function to force refreshing the form data
  const handleRefresh = () => {
    console.log("Forcing refresh of public form data");
    formData.reloadFromRemote();
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
      projectId: projectId || undefined
    };
    
    console.log("Public form submitting with project ID:", submissionData.projectId);
    console.log("Public form submission data:", {
      hasText: !!submissionData.text,
      hasTitle: !!submissionData.title,
      sliderResponsesCount: submissionData.sliderResponses?.length || 0,
      participantResponsesCount: submissionData.participantResponses?.length || 0
    });
    
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
      {/* Debug and refresh controls - only visible to superadmins */}
      {process.env.NODE_ENV !== 'production' && isSuperAdmin() && (
        <div className="mb-4 flex flex-wrap gap-2 justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleDebug}
            className="text-xs bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
          >
            {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="text-xs"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Form Data
          </Button>
        </div>
      )}
      
      {/* Debug information panel - only visible when showDebug is true and user is superadmin */}
      {showDebug && isSuperAdmin() && (
        <div className="mt-2 mb-4 bg-yellow-50 p-4 rounded border border-yellow-300 text-xs overflow-auto max-h-[300px]">
          <h3 className="font-bold mb-2">Public Form Debug Information (Unified Loader)</h3>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p><strong>Form ID:</strong> {formId || 'Not provided'}</p>
              <p><strong>Project ID:</strong> {projectId || 'Not provided'}</p>
              <p><strong>Story Question:</strong> {formData.storyQuestion || 'None'}</p>
            </div>
            <div>
              <p><strong>Slider Questions:</strong> {formData.sliderQuestions?.length || 0}</p>
              <p><strong>Participant Questions:</strong> {formData.participantQuestions?.length || 0}</p>
              <p><strong>Is Loading:</strong> {formData.isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Error:</strong> {formData.error || 'None'}</p>
            </div>
          </div>
          
          {(!formData.sliderQuestions || formData.sliderQuestions.length === 0) && 
           (!formData.participantQuestions || formData.participantQuestions.length === 0) && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Missing Form Elements</AlertTitle>
              <AlertDescription>
                No slider or participant questions were loaded. This could indicate a synchronization issue
                or that the form hasn't been fully configured yet.
              </AlertDescription>
            </Alert>
          )}
          
          {formData.sliderQuestions && formData.sliderQuestions.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold">Slider Questions:</h4>
              <ul className="list-disc pl-5">
                {formData.sliderQuestions.map((q, idx) => (
                  <li key={idx}>{q.question?.substring(0, 40) || 'No question text'} (ID: {q.id})</li>
                ))}
              </ul>
            </div>
          )}
          
          {formData.participantQuestions && formData.participantQuestions.length > 0 && (
            <div className="mt-2">
              <h4 className="font-semibold">Participant Questions:</h4>
              <ul className="list-disc pl-5">
                {formData.participantQuestions.map((q, idx) => (
                  <li key={idx}>{q.label?.substring(0, 40) || 'No label'} (ID: {q.id})</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Demo account limit message */}
      {demoLimitReached && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Demo Limit Reached</AlertTitle>
          <AlertDescription>
            This project has reached the maximum of 15 stories for demo accounts. 
            Please contact the project owner to upgrade their account for unlimited stories.
          </AlertDescription>
        </Alert>
      )}
      
      {demoLimitReached ? (
        <div className="text-center p-8 border rounded-lg bg-muted">
          <h3 className="text-xl font-semibold mb-2">Demo Account Limit Reached</h3>
          <p>This project has reached the maximum of 15 stories.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Demo accounts are limited to 15 stories per project.
            Please contact the owner to upgrade their account for unlimited access.
          </p>
        </div>
      ) : (
        <ErrorBoundary
          fallback={
            <FormErrorFallback 
              title="Form Error" 
              message="There was a problem with the form. Please try reloading the page."
              resetError={handleRefresh}
            />
          }
        >
          <FormProvider 
            initialValues={{
              storyQuestion: formData.storyQuestion || "",
              sliderQuestions: formData.sliderQuestions || [], 
              participantQuestions: formData.participantQuestions || []
            }}
            onSubmit={handleSubmit}
            key={`form-provider-${refreshTrigger}`}
          >
            <StoryForm isPublic={true} />
          </FormProvider>
        </ErrorBoundary>
      )}
    </div>
  );
};

export default PublicFormContainer2;
