
export interface SliderTheme {
  id: number;
  theme: string;
  question: string;
  leftLabel: string;
  rightLabel: string;
  sliderValue?: number;
}

export const defaultSliderThemes: SliderTheme[] = [
  {
    id: 1,
    theme: "Impact Level",
    question: "How much do you feel the factor was impacted by the experience you shared?",
    leftLabel: "Not Relevant",
    rightLabel: "Central",
    sliderValue: 50
  },
  {
    id: 2,
    theme: "Positive/Negative Influence",
    question: "To what extent did the factor have a positive or negative influence on the outcome?",
    leftLabel: "Detrimental",
    rightLabel: "Beneficial",
    sliderValue: 50
  },
  {
    id: 3,
    theme: "Control Level",
    question: "To what degree was the factor something you could control?",
    leftLabel: "Uncontrollable",
    rightLabel: "Fully Controllable",
    sliderValue: 50
  }
];
