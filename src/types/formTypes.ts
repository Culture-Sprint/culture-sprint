
export interface FormDataState {
  storyQuestion: string;
  storyText?: string;
  storyTitle?: string;
  feeling?: string;
  otherFeeling?: string;
  sliderQuestions: any[];
  participantQuestions: any[];
  additionalComments?: string;
  formDesigned: boolean;
  isLoading: boolean;
  error?: string | null;
}
