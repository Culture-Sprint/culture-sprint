
export interface QuestionChoice {
  id: string;
  label: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  label: string;
  choices: QuestionChoice[];
}
