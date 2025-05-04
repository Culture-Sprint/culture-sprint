
import { FormDataState } from "@/types/formTypes";

/**
 * Standardized logging function for form data loading
 */
export function logFormAction(action: string, details: Record<string, any>): void {
  console.log(`FormLoader [${action}]:`, details);
}

/**
 * Check if a form has been designed (has questions)
 */
export function checkFormDesigned(formData: Partial<FormDataState>): boolean {
  const hasStoryQuestion = Boolean(formData?.storyQuestion && formData.storyQuestion.trim().length > 0);
  const hasSliderQuestions = Array.isArray(formData?.sliderQuestions) && formData.sliderQuestions.length > 0;
  const hasParticipantQuestions = Array.isArray(formData?.participantQuestions) && formData.participantQuestions.length > 0;
  
  return hasStoryQuestion || hasSliderQuestions || hasParticipantQuestions;
}

/**
 * Get default form data state
 */
export function getDefaultFormData(error?: string | null): FormDataState {
  return {
    storyQuestion: "Please share your story with us.",
    sliderQuestions: [],
    participantQuestions: [],
    formDesigned: false,
    isLoading: false,
    error: error || null
  };
}
