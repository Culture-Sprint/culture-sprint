
export interface StoryData {
  title: string;
  text: string;
  emotionalResponse: string;
  additionalComments?: string;
  sliderResponses?: any[];
  participantResponses?: any[];
  projectId?: string;
  isImported?: boolean;
  hasAudio?: boolean;
  audioData?: string; // Base64 audio data
}

// Add the missing FormSubmissionHandler type
export type FormSubmissionHandler = (data: StoryData) => Promise<boolean | string>;

// Add SliderResponseData type
export interface SliderResponseData {
  story_id: string;
  question_id: string | number;
  question_text: string;
  value: number | null;
  response_type?: string;
  left_label?: string;
  right_label?: string;
  sr_project_id?: string;
}

// Add ParticipantResponseData type
export interface ParticipantResponseData {
  story_id: string;
  question_id: string;
  question_text: string;
  response: string;
  pr_project_id?: string;
}
