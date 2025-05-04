
export function buildSliderResponses(sliderQuestions, sliderValues, touchedSliders) {
  return sliderQuestions.map(question => {
    const value = sliderValues[question.id];
    const numericValue = typeof value === 'number' ? value : null;
    return {
      questionId: question.id,
      questionText: question.question,
      leftLabel: question.leftLabel,
      rightLabel: question.rightLabel,
      value: numericValue,
      responseType: touchedSliders.has(question.id) ? 'answered' : 'skipped'
    };
  });
}
