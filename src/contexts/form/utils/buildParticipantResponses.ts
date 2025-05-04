
export function buildParticipantResponses(participantQuestions, participantAnswers) {
  if (!participantQuestions || !Array.isArray(participantQuestions)) return [];
  return participantQuestions.map(question => {
    const choiceId = participantAnswers[question.id] || '';
    let choiceText = choiceId;

    if (question.choices && Array.isArray(question.choices) && question.choices.length > 0) {
      const selectedChoice = question.choices.find(c => c.id === choiceId);
      choiceText = selectedChoice ? selectedChoice.label : choiceId;
    }
    return {
      questionId: question.id,
      questionText: question.label,
      choiceId,
      choiceText
    };
  }).filter(response => response.choiceId && response.choiceId.trim() !== '');
}
