
import { ParticipantQuestion, SliderQuestion } from '../types/designTypes';

export interface PublicFormData {
  storyQuestion: string;
  sliderQuestions: SliderQuestion[];
  participantQuestions: ParticipantQuestion[];
}

export interface PublicFormResponse {
  id: string;
  storyQuestion?: string;
  sliderQuestions?: SliderQuestion[];
  participantQuestions?: ParticipantQuestion[];
}

// Activity IDs for public form components
export const PUBLIC_FORM_ACTIVITIES = {
  STORY_QUESTION: 'story-question',
  SLIDER_QUESTIONS: 'slider-questions',
  PARTICIPANT_QUESTIONS: 'participant-questions',
  FORM_CONFIG: 'form-config',
  FORM_APPEARANCE: 'form-appearance'
};

// This is for extracting data from supabase response
export interface ActivityResponse {
  ar_response: {
    [key: string]: any;
  };
}

// Utility function to check if a value is a plain object (not null, not array, a true object)
export const isPlainObject = (value: any): value is Record<string, any> => {
  return typeof value === 'object' && 
         value !== null && 
         !Array.isArray(value) && 
         Object.prototype.toString.call(value) === '[object Object]';
};
