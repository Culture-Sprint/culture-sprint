import { FormDataFetchUtils, FormDataFetchOptions } from "./types";
import { FormDataState } from "@/types/formTypes";
import { logFormAction, getDefaultFormData } from "./formLoadingUtils";
import { PublicFormData } from "@/services/publicForm/types";

/**
 * Hook providing form data fetching utilities
 * @returns Form data fetching utilities
 */
export function useFormDataFetch(): FormDataFetchUtils {
  /**
   * Fetch form data for a specific project
   */
  const fetchProjectFormData = async (projectId: string): Promise<FormDataState> => {
    console.group(`🔍 Project Form Data Fetch: ${projectId}`);
    console.time('Total Form Data Components Fetch');
    
    logFormAction("FetchProject", { projectId });
    
    try {
      console.time('Story Question Fetch');
      const { getStoryQuestionWithSync } = await import('@/services/designOutputService');
      const storyQuestion = await getStoryQuestionWithSync(projectId);
      console.timeEnd('Story Question Fetch');
      
      console.time('Slider Questions Fetch');
      const { getSliderQuestions } = await import('@/services/sliderQuestionsService');
      const sliderQuestions = await getSliderQuestions();
      console.timeEnd('Slider Questions Fetch');
      
      console.time('Participant Questions Fetch');
      const { getParticipantQuestionsWithSync } = await import('@/services/sync/participantQuestionsSyncService');
      const participantQuestions = await getParticipantQuestionsWithSync(projectId);
      console.timeEnd('Participant Questions Fetch');
      
      const defaultStoryQuestion = "Please share your story with us.";
      const finalStoryQuestion = storyQuestion || defaultStoryQuestion;
      
      const formData = {
        storyQuestion: finalStoryQuestion,
        sliderQuestions: sliderQuestions || [],
        participantQuestions: participantQuestions || [],
        formDesigned: true,
        isLoading: false
      };
      
      console.log("Form Data Components Fetch Summary:", { 
        storyQuestionLength: finalStoryQuestion.length,
        sliderQuestionsCount: sliderQuestions?.length || 0,
        participantQuestionsCount: participantQuestions?.length || 0
      });
      
      console.timeEnd('Total Form Data Components Fetch');
      console.groupEnd();
      
      logFormAction("FetchProjectSuccess", { 
        projectId,
        hasStoryQuestion: !!storyQuestion,
        sliderCount: sliderQuestions?.length || 0,
        participantCount: participantQuestions?.length || 0
      });
      
      return formData;
    } catch (error) {
      console.error("Form Data Fetch Error:", error);
      console.timeEnd('Total Form Data Components Fetch');
      console.groupEnd();
      
      return handleFetchError(error);
    }
  };

  /**
   * Fetch form data for a public form
   */
  const fetchPublicFormData = async (projectId: string): Promise<FormDataState> => {
    logFormAction("FetchPublic", { projectId });
    
    try {
      // Dynamically import to avoid circular dependencies
      const { getPublicForm } = await import('@/services/publicForm/publicFormService');
      const publicFormData = await getPublicForm(projectId);
      
      if (!publicFormData) {
        logFormAction("FetchPublicNoData", { projectId });
        return getDefaultFormData("No form data found");
      }
      
      const formData = {
        storyQuestion: publicFormData.storyQuestion || "",
        sliderQuestions: publicFormData.sliderQuestions || [],
        participantQuestions: publicFormData.participantQuestions || [],
        formDesigned: true,
        isLoading: false
      };
      
      logFormAction("FetchPublicSuccess", { 
        projectId,
        hasStoryQuestion: !!publicFormData.storyQuestion,
        sliderCount: publicFormData.sliderQuestions?.length || 0,
        participantCount: publicFormData.participantQuestions?.length || 0
      });
      
      return formData;
    } catch (error) {
      logFormAction("FetchPublicError", { projectId, error });
      return handleFetchError(error);
    }
  };

  /**
   * Returns default form data when no project is selected
   */
  const fetchLocalFormData = async (): Promise<FormDataState> => {
    logFormAction("FetchLocal", { message: "No project selected" });
    
    // Return default form state when no project is selected
    return getDefaultFormData();
  };

  /**
   * Handles errors in form data fetching
   */
  const handleFetchError = (error: any): FormDataState => {
    const errorMessage = error instanceof Error ? error.message : "Failed to load form data";
    logFormAction("FetchError", { error: errorMessage });
    
    return getDefaultFormData(errorMessage);
  };

  return {
    fetchProjectFormData,
    fetchLocalFormData,
    handleFetchError
  };
}
