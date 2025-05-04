
export interface SliderResponse {
  id: string;
  question_id: number;
  question_text: string;
  value: number | null;
  response_type: "answered" | "skipped";
  left_label?: string;
  right_label?: string;
}

export interface ParticipantResponse {
  id: string;
  question_id: string;
  question_text: string;
  response: string;
}

export interface Story {
  id: number | string;
  title: string;
  text: string;
  name?: string;
  email?: string;
  feeling: string;
  feelingSentiment?: "positive" | "neutral" | "negative";
  impact?: number;
  date: string;
  isPublic?: boolean;
  isImported?: boolean;
  additional_comments?: string;
  sliderResponses?: SliderResponse[];
  participantResponses?: ParticipantResponse[];
  project_id?: string;
  isSaved?: boolean; // Added for saved story functionality
  has_audio?: boolean; // Flag indicating if this story has an audio recording
  audio_url?: string; // URL to the audio file
}
