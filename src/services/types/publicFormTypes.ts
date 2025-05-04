
import { SliderQuestion, ParticipantQuestion } from "./designTypes";

export interface PublicFormData {
  storyQuestion: string;
  sliderQuestions: SliderQuestion[];
  participantQuestions: ParticipantQuestion[];
}
