
import { fetchProjectFormData } from "./form-fetch/formDataFetchUtils";
import { FormData } from "./form-fetch/formDataTypes";
import { setLastLoadedProjectId } from "@/services/cache/projectCache";

export async function useAuthenticatedFormDataFetch(
  projectId: string,
  save: (data: any) => void,
  cacheKey: string,
  setFormData: (data: FormData) => void
) {
  console.log(`useAuthenticatedFormDataFetch: Starting fetch for project ${projectId}`);
  
  try {
    console.time(`[FormFetch][${projectId}] Total fetch time`);
    const data = await fetchProjectFormData(projectId);
    console.timeEnd(`[FormFetch][${projectId}] Total fetch time`);
    
    console.log(`useAuthenticatedFormDataFetch: Successfully fetched data for ${projectId}:`, {
      hasStoryQuestion: !!data.storyQuestion,
      sliderQuestionsCount: data.sliderQuestions?.length || 0,
      participantQuestionsCount: data.participantQuestions?.length || 0
    });
    
    setFormData({
      ...data,
      isLoading: false
    });
    
    save(data);
    setLastLoadedProjectId(projectId);
    
    console.log(`useAuthenticatedFormDataFetch: Completed for project ${projectId}`);
  } catch (error) {
    console.error(`useAuthenticatedFormDataFetch: Error fetching form data for project ${projectId}:`, error);
    setFormData({
      storyQuestion: "",
      sliderQuestions: [],
      participantQuestions: [],
      isLoading: false
    });
  }
}
