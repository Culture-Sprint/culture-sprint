
import { useState, useEffect } from "react";
import { useProjectIdResolver } from "./useProjectIdResolver";
import { getPublicForm } from "@/services/publicFormService";
import { FormDataState } from "@/types/formTypes";
import { logPublicFormData } from "@/utils/publicFormDebug";

/**
 * Extended FormDataState type with resolvedProjectId for public forms
 */
interface PublicFormDataState extends FormDataState {
  resolvedProjectId?: string | null;
}

/**
 * Hook for loading form data for public forms
 * @param formId Unique form identifier
 * @param projectId Optional direct project ID if known
 * @returns FormDataState with loaded form data
 */
export const usePublicFormDataLoader = (formId?: string | null, projectId?: string | null) => {
  const [formData, setFormData] = useState<PublicFormDataState>({
    storyQuestion: "",
    sliderQuestions: [],
    participantQuestions: [],
    formDesigned: true,
    isLoading: true,
    error: null,
    resolvedProjectId: null
  });
  
  const [attemptCount, setAttemptCount] = useState(0);
  const maxAttempts = 2;

  // Only use the project ID resolver if we don't already have a project ID
  const { 
    projectId: resolvedProjectId, 
    loading: resolvingProjectId,
    error: projectResolutionError
  } = useProjectIdResolver(!projectId, formId);

  // Determine the final project ID to use
  const finalProjectId = projectId || resolvedProjectId;

  // Load data from service
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      // If we already have a project ID, we can skip the resolving check
      if (!projectId && resolvingProjectId) {
        console.log("Still resolving project ID, waiting...");
        return; // Wait until project ID resolution is complete
      }
      
      if (projectResolutionError) {
        setFormData(prev => ({
          ...prev,
          isLoading: false,
          error: projectResolutionError
        }));
        return;
      }
      
      if (!finalProjectId) {
        setFormData(prev => ({
          ...prev,
          isLoading: false,
          error: "This form link appears to be invalid or expired."
        }));
        return;
      }
      
      try {
        console.log(`PublicFormDataLoader - Loading form data for project: ${finalProjectId} (attempt ${attemptCount + 1}/${maxAttempts})`);
        
        const publicFormData = await getPublicForm(finalProjectId);
        
        if (!publicFormData) {
          setFormData(prev => ({
            ...prev,
            isLoading: false,
            error: "Form configuration not found. Please contact the form creator."
          }));
          return;
        }
        
        // Add enhanced debug logging
        logPublicFormData(
          formId,
          projectId,
          finalProjectId,
          publicFormData.storyQuestion,
          publicFormData.sliderQuestions,
          publicFormData.participantQuestions,
          "PublicFormDataLoader"
        );
        
        // Check if we have empty data but haven't reached max attempts
        if (attemptCount < maxAttempts - 1 && 
            (!publicFormData.storyQuestion || publicFormData.storyQuestion.trim() === "") &&
            (!publicFormData.sliderQuestions || publicFormData.sliderQuestions.length === 0) &&
            (!publicFormData.participantQuestions || publicFormData.participantQuestions.length === 0)) {
          
          console.log(`Empty form data on attempt ${attemptCount + 1}, will retry...`);
          
          if (isMounted) {
            setAttemptCount(prev => prev + 1);
          }
          
          // Add a small delay before retrying
          await new Promise(resolve => setTimeout(resolve, 800));
          return;
        }
        
        if (isMounted) {
          setFormData({
            storyQuestion: publicFormData.storyQuestion || "",
            sliderQuestions: publicFormData.sliderQuestions || [],
            participantQuestions: publicFormData.participantQuestions || [],
            formDesigned: true,
            isLoading: false,
            error: null,
            resolvedProjectId: finalProjectId
          });
        }
      } catch (error) {
        console.error("Error loading public form data:", error);
        if (isMounted) {
          setFormData(prev => ({
            ...prev,
            isLoading: false,
            error: "An error occurred while loading the form. Please try again later."
          }));
        }
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [finalProjectId, resolvingProjectId, projectResolutionError, projectId, attemptCount, formId]);

  return formData;
};
