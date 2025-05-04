
import { useState, useEffect } from "react";
import { FormDataState } from "@/types/formTypes";
import { getPublicForm } from "@/services/publicFormService";
import { handleFetchError } from "./formDataFetchUtils";

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
          storyQuestion: "Please share your story with us.",
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
          // Here we would typically resolve the formId to a projectId
          // This is a placeholder for that logic
          projectId = fallbackProjectId || null;
        } else if (fallbackProjectId) {
          projectId = fallbackProjectId;
        }

        if (!projectId) {
          setFormData({
            storyQuestion: "Please share your story with us.",
            sliderQuestions: [],
            participantQuestions: [],
            formDesigned: false,
            isLoading: false,
            error: "Could not resolve form ID to a project"
          });
          return;
        }

        const publicFormData = await getPublicForm(projectId);
        
        if (publicFormData) {
          setFormData({
            storyQuestion: publicFormData.storyQuestion || "",
            sliderQuestions: publicFormData.sliderQuestions || [],
            participantQuestions: publicFormData.participantQuestions || [],
            formDesigned: true,
            isLoading: false,
            error: null
          });
        } else {
          setFormData({
            storyQuestion: "Please share your story with us.",
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
