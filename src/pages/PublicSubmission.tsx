
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useProjectIdResolver } from "@/hooks/collect/useProjectIdResolver";
import { useFormAppearanceLoader } from "@/hooks/collect/useFormAppearanceLoader";
import FormAppearanceDebug from "@/components/public/FormAppearanceDebug";
import FormDebugDialog from "@/components/public/FormDebugDialog";
import { toast } from "@/components/ui/use-toast";
import FormDataDebugger from "@/components/collect/public/FormDataDebugger";
import { useUserRole } from "@/hooks/useUserRole";
import ImplementationToggle from "@/components/public/form/ImplementationToggle";
import TestingAlert from "@/components/public/form/TestingAlert";
import FormErrorDisplay from "@/components/public/form/FormErrorDisplay";
import FormCard from "@/components/public/form/FormCard";

const PublicSubmission = () => {
  const { formId } = useParams();
  const [isReady, setIsReady] = useState(false);
  const [showDebugDialog, setShowDebugDialog] = useState(false);
  const [useNewImplementation, setUseNewImplementation] = useState(false);
  const { isSuperAdmin } = useUserRole();
  
  // Use the project ID resolver to get the project ID from the form ID
  const { 
    projectId, 
    loading: resolvingProjectId,
    error: projectResolutionError
  } = useProjectIdResolver(true, formId);
  
  // Load form appearance settings - passing only the allowed arguments
  const { appearance, isLoading, debugInfo } = useFormAppearanceLoader(
    projectId,
    true // debug mode enabled
  );
  
  // Debug: Log when the component mounts and the formId parameter
  useEffect(() => {
    console.log("PublicSubmission component mounted with formId:", formId);
  }, [formId]);

  // Debug: Log changes in project ID resolution
  useEffect(() => {
    console.log("Project resolution state:", {
      projectId,
      isResolving: resolvingProjectId,
      error: projectResolutionError
    });
  }, [projectId, resolvingProjectId, projectResolutionError]);
  
  // Add a slight delay to ensure any route transitions are complete
  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setIsReady(true);
      }, 100);
    }
  }, [isLoading]);
  
  // Function to toggle detailed debug dialog
  const toggleDebugDialog = () => setShowDebugDialog(!showDebugDialog);
  
  // Function to toggle between implementations
  const toggleImplementation = () => {
    setUseNewImplementation(prev => !prev);
    toast({
      title: `Using ${!useNewImplementation ? 'New' : 'Original'} Implementation`,
      description: `Switched to ${!useNewImplementation ? 'new unified' : 'original'} form data loading logic`,
    });
  };
  
  // Show an error message if there was a problem resolving the project ID
  if (!isLoading && projectResolutionError && !resolvingProjectId) {
    return (
      <PageLayout simplified allowMobile>
        <div className="flex items-center justify-center min-h-screen py-8 px-4">
          <div className="w-full max-w-4xl">
            <FormErrorDisplay 
              error={projectResolutionError} 
              debugInfo={debugInfo} 
            />
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout simplified allowMobile>
      <div className="flex items-center justify-center min-h-screen py-8 px-4">
        <div className="w-full max-w-4xl">
          {/* Controls for admin users */}
          {isSuperAdmin() && (
            <ImplementationToggle
              useNewImplementation={useNewImplementation}
              toggleImplementation={toggleImplementation}
              toggleDebugDialog={toggleDebugDialog}
            />
          )}
          
          {/* Show notification banner about testing for superadmins */}
          {isSuperAdmin() && (
            <TestingAlert useNewImplementation={useNewImplementation} />
          )}
          
          {/* Debug overlay for development and superadmins */}
          {process.env.NODE_ENV !== 'production' && isSuperAdmin() && (
            <FormAppearanceDebug 
              appearance={appearance}
              projectId={projectId}
              debugInfo={debugInfo}
              isResolving={resolvingProjectId}
              resolutionError={projectResolutionError}
            />
          )}
          
          {/* Add the form data debugger for non-production and superadmins */}
          <FormDataDebugger projectId={projectId} formId={formId} />
          
          {/* Debug dialog with full information */}
          <FormDebugDialog
            open={showDebugDialog}
            onOpenChange={setShowDebugDialog}
            formId={formId}
            projectId={projectId}
            resolvingProjectId={resolvingProjectId}
            projectResolutionError={projectResolutionError}
            appearance={appearance}
            debugInfo={debugInfo}
          />
          
          {/* Main form card */}
          <FormCard
            formId={formId}
            projectId={projectId}
            appearance={appearance}
            isReady={isReady}
            useNewImplementation={useNewImplementation}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default PublicSubmission;
