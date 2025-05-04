
import { getPublicForm } from "@/services/publicFormService";
import { FormData } from "./form-fetch/formDataTypes";

export async function usePublicFormDataFetch(
  projectId: string,
  save: (data: any) => void,
  cacheKey: string,
  setFormData: (data: FormData) => void
) {
  try {
    const publicFormData = await getPublicForm(projectId);
    if (publicFormData) {
      const newFormData = {
        storyQuestion: publicFormData.storyQuestion || "",
        sliderQuestions: publicFormData.sliderQuestions || [],
        participantQuestions: publicFormData.participantQuestions || [],
        isLoading: false,
      };
      setFormData(newFormData);
      save(newFormData);
      sessionStorage.setItem("last_loaded_project_id", cacheKey);
    } else {
      // Create a new FormData object directly instead of using updater function
      setFormData({
        storyQuestion: "",
        sliderQuestions: [],
        participantQuestions: [],
        isLoading: false
      });
    }
  } catch (error) {
    console.error("Error fetching public form data:", error);
    // Create a new FormData object directly instead of using updater function
    setFormData({
      storyQuestion: "",
      sliderQuestions: [],
      participantQuestions: [],
      isLoading: false
    });
  }
}
