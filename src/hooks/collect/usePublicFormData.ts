
import { useState, useEffect } from "react";
import { FormDataState } from "@/types/formTypes";
import { getPublicForm } from "@/services/publicFormService";
import { handleFetchError } from "./form-fetch/formDataFetchUtils";

/**
 * Hook for loading form data for public forms
 * @param formId Unique form identifier
 * @param fallbackProjectId Optional project ID to use if formId lookup fails
 * @returns FormDataState with loaded form data
 */
export const usePublicFormData = (formId?: string, fallbackProjectId?: string | null) => {
  const [formData, setFormData] = useState<FormDataState>({
    storyQuestion: "",
    sliderQuestions: [],
    participantQuestions: [],
    formDesigned: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!formId && !fallbackProjectId) {
        setFormData({
          storyQuestion: "",
          sliderQuestions: [],
          participantQuestions: [],
          formDesigned: false,
          isLoading: false,
          error: "No form identifier or project ID provided"
        });
        return;
      }

      try {
        // Try to load using the form ID first
        let projectId: string | null = null;
        if (formId) {
          // Use the provided fallbackProjectId directly if available
          projectId = fallbackProjectId || null;
        } else if (fallbackProjectId) {
          projectId = fallbackProjectId;
        }

        if (!projectId) {
          setFormData({
            storyQuestion: "",
            sliderQuestions: [],
            participantQuestions: [],
            formDesigned: false,
            isLoading: false,
            error: "Could not resolve form ID to a project"
          });
          return;
        }

        // Log that we're attempting to fetch form data
        console.log(`usePublicFormData - Fetching form data for project: ${projectId}`);
        
        // Use the public form service which should bypass RLS
        const publicFormData = await getPublicForm(projectId);
        
        if (publicFormData) {
          console.log("usePublicFormData - Got form data:", {
            storyQuestion: publicFormData.storyQuestion?.substring(0, 30),
            sliderQuestionsCount: publicFormData.sliderQuestions?.length || 0,
            participantQuestionsCount: publicFormData.participantQuestions?.length || 0
          });
          
          // Set successfully loaded form data
          setFormData({
            storyQuestion: publicFormData.storyQuestion || "",
            sliderQuestions: publicFormData.sliderQuestions || [],
            participantQuestions: publicFormData.participantQuestions || [],
            formDesigned: true,
            isLoading: false,
            error: null
          });
        } else {
          console.error("usePublicFormData - No form data returned from publicFormService");
          setFormData({
            storyQuestion: "",
            sliderQuestions: [],
            participantQuestions: [],
            formDesigned: false,
            isLoading: false,
            error: "Form not found"
          });
        }
      } catch (error) {
        console.error("Error loading public form data:", error);
        const errorFormData = handleFetchError(error);
        setFormData({
          ...errorFormData,
          formDesigned: false  // Ensure formDesigned is set for FormDataState
        });
      }
    };

    fetchData();
  }, [formId, fallbackProjectId]);

  return formData;
};
