
// Handles updating participant values & answers state

import { useCallback, useState } from "react";

export function useParticipantAnswers(setParticipantAnswers) {
  const [participantValues, setParticipantValues] = useState<Record<string, string>>({});

  const updateParticipantValue = useCallback((questionId: string, value: string) => {
    setParticipantValues(prev => ({ ...prev, [questionId]: value }));
    setParticipantAnswers(prev => ({ ...prev, [questionId]: value }));
  }, [setParticipantAnswers]);

  const handleParticipantAnswerChange = useCallback((questionId: string, value: string) => {
    updateParticipantValue(questionId, value);
    setParticipantAnswers(prev => ({ ...prev, [questionId]: value }));
  }, [updateParticipantValue, setParticipantAnswers]);

  return {
    participantValues,
    updateParticipantValue,
    handleParticipantAnswerChange,
  };
}
