
// Type definitions for design outputs

export interface ParticipantQuestion {
  id: string;
  label: string;
  checked?: boolean;
  choices: {
    id: string;
    label: string;
  }[];
}

export interface SliderQuestion {
  id: number;
  theme: string;
  question: string;
  leftLabel: string;
  rightLabel: string;
  sliderValue?: number;
}
