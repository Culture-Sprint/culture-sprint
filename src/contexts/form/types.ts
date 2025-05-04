
import { SliderQuestion, ParticipantQuestion } from "@/services/types/designTypes";
import { StoryData } from "@/hooks/collect/form-submission/types";

export interface FormContextType {
  // Form fields
  storyQuestion: string;
  storyTitle: string;
  setStoryTitle: (title: string) => void;
  storyText: string;
  setStoryText: (text: string) => void;
  feeling: string;
  setFeeling: (feeling: string) => void;
  otherFeeling: string;
  setOtherFeeling: (feeling: string) => void;
  additionalComments: string;
  setAdditionalComments: (comments: string) => void;
  
  // Slider questions
  sliderQuestions: SliderQuestion[];
  sliderValues: Record<string | number, number | null | "n/a">;
  updateSliderValue: (id: string | number, value: number | null) => void;
  handleSliderChange: (id: number | string, value: number[] | "n/a") => void;
  touchedSliders: Set<number>;
  setTouchedSliders: (updatedSet: Set<number>) => void;
  
  // Participant questions
  participantQuestions: ParticipantQuestion[];
  participantValues: Record<string, string>;
  updateParticipantValue: (questionId: string, choiceId: string, checked: boolean) => void;
  participantAnswers: Record<string, string>;
  handleParticipantAnswerChange: (id: string, value: string) => void;
  
  // Form submission
  handleSubmit: (e: React.FormEvent) => void;
  onSubmit: (data: StoryData) => Promise<boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormProviderProps {
  initialValues: {
    storyQuestion: string;
    sliderQuestions: SliderQuestion[];
    participantQuestions: ParticipantQuestion[];
  };
  onSubmit: (data: StoryData) => Promise<boolean>;
  children: React.ReactNode;
}

// Add the missing FormHandlersProps interface with the new setParticipantAnswers property
export interface FormHandlersProps {
  storyText: string;
  storyTitle: string;
  feeling: string;
  otherFeeling: string;
  additionalComments: string;
  touchedSliders: Set<number>;
  sliderValues: Record<string | number, number | null | "n/a">;
  sliderQuestions: SliderQuestion[];
  participantQuestions: ParticipantQuestion[];
  participantAnswers: Record<string, string>;
  setParticipantAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  onSubmit: (data: StoryData) => Promise<boolean>;
}

// Re-export StoryData type from the submission types - fixed with 'export type'
export type { StoryData };
