
/**
 * Debug utility functions for public form issues
 */

/**
 * Formats project and form IDs for debugging
 */
export const formatIds = (formId?: string | null, projectId?: string | null, resolvedProjectId?: string | null) => {
  return {
    formId: formId || "Not provided",
    projectId: projectId || "Not provided",
    resolvedProjectId: resolvedProjectId || "None",
    hasFormId: !!formId,
    hasProjectId: !!projectId,
    hasResolvedProjectId: !!resolvedProjectId
  };
};

/**
 * Formats questions data for debugging
 */
export const formatQuestionsData = (
  storyQuestion?: string | null,
  sliderQuestions?: any[] | null,
  participantQuestions?: any[] | null
) => {
  return {
    hasStoryQuestion: !!storyQuestion && storyQuestion.trim() !== "",
    storyQuestionPreview: storyQuestion ? 
      `${storyQuestion.substring(0, 40)}${storyQuestion.length > 40 ? '...' : ''}` : 
      "None",
    sliderQuestionsCount: sliderQuestions?.length || 0,
    participantQuestionsCount: participantQuestions?.length || 0,
    sliderQuestionsSample: sliderQuestions && sliderQuestions.length > 0 
      ? sliderQuestions.slice(0, 2).map(q => ({
          id: q.id,
          question: q.question ? 
            `${q.question.substring(0, 30)}${q.question.length > 30 ? '...' : ''}` : 
            "No question text"
        }))
      : [],
    participantQuestionsSample: participantQuestions && participantQuestions.length > 0
      ? participantQuestions.slice(0, 2).map(q => ({
          id: q.id,
          label: q.label ? 
            `${q.label.substring(0, 30)}${q.label.length > 30 ? '...' : ''}` : 
            "No label"
        }))
      : []
  };
};

/**
 * Logs complete public form data for debugging
 */
export const logPublicFormData = (
  formId?: string | null, 
  projectId?: string | null, 
  resolvedProjectId?: string | null,
  storyQuestion?: string | null,
  sliderQuestions?: any[] | null,
  participantQuestions?: any[] | null,
  prefix = "PublicForm"
) => {
  const idInfo = formatIds(formId, projectId, resolvedProjectId);
  const questionsInfo = formatQuestionsData(storyQuestion, sliderQuestions, participantQuestions);
  
  console.log(`${prefix} - Debug Info:`, {
    ...idInfo,
    ...questionsInfo,
    timestamp: new Date().toISOString()
  });
  
  return { idInfo, questionsInfo };
};
