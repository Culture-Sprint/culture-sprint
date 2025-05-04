
import { SliderQuestion } from "@/services/types/designTypes";

/**
 * Basic form data structure
 */
export interface FormData {
  storyQuestion: string;
  sliderQuestions: SliderQuestion[];
  participantQuestions: any[]; // Using any[] instead of importing from participantTypes
  isLoading: boolean;
  formDesigned?: boolean;
  error?: string | null;
}

/**
 * Form data with included fetcher utilities
 */
export interface FormDataWithFetchers extends FormData {
  fetchProjectFormData: (projectId: string) => Promise<FormData>;
  fetchLocalFormData: () => FormData;
  handleFetchError: (error: any) => FormData;
  refreshFormData?: () => Promise<void>;
  reloadFromRemote?: () => Promise<void>;
}
