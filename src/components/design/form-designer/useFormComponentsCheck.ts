
import { useState, useEffect } from "react";
import { getStoryQuestionWithSync } from "@/services/sync/storyQuestionSyncService";
import { getSliderQuestionsWithSync } from "@/services/sync/sliderQuestionsSyncService";
import { getParticipantQuestionsWithSync } from "@/services/sync/participantQuestionsSyncService";
import { useFormValidationToasts } from "./useFormValidationToasts";

interface CheckResults {
  hasStoryQuestion: boolean;
  hasSliderQuestions: boolean;
  hasParticipantQuestions: boolean;
}

export const useFormComponentsCheck = (projectId: string | undefined) => {
  const { showValidationToasts, showErrorToast } = useFormValidationToasts();
  const [isCheckingQuestions, setIsCheckingQuestions] = useState(false);
  const [checkResults, setCheckResults] = useState<CheckResults>({
    hasStoryQuestion: false,
    hasSliderQuestions: false, 
    hasParticipantQuestions: false
  });

  useEffect(() => {
    if (projectId) {
      checkFormComponents(projectId, false);
    }
  }, [projectId]);

  const checkFormComponents = async (projectId: string, showToasts = true) => {
    setIsCheckingQuestions(true);
    
    try {
      console.log("FormDesigner: Checking form components for project:", projectId);
      
      const storyQuestion = await getStoryQuestionWithSync(projectId);
      const hasStoryQuestion = storyQuestion && storyQuestion.trim().length > 3;
      
      const sliderQuestions = await getSliderQuestionsWithSync(projectId);
      const hasSliderQuestions = Array.isArray(sliderQuestions) && sliderQuestions.length > 0;
      
      const participantQuestions = await getParticipantQuestionsWithSync(projectId);
      const hasParticipantQuestions = Array.isArray(participantQuestions) && participantQuestions.length > 0;
      
      console.log("FormDesigner: Form component check results:", {
        hasStoryQuestion,
        hasSliderQuestions,
        hasParticipantQuestions,
        storyLength: storyQuestion?.length || 0,
        sliderCount: sliderQuestions?.length || 0,
        participantCount: participantQuestions?.length || 0
      });
      
      const newCheckResults = {
        hasStoryQuestion,
        hasSliderQuestions, 
        hasParticipantQuestions
      };
      
      setCheckResults(newCheckResults);
      
      // Update localStorage flags to ensure consistency
      if (hasStoryQuestion) {
        localStorage.setItem(`culturesprint_story_question_saved_${projectId}`, 'true');
      }
      
      if (hasSliderQuestions) {
        localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
        localStorage.setItem('sliderThemesSaved', 'true');
      }
      
      if (hasParticipantQuestions) {
        localStorage.setItem(`participantQuestionsSaved_${projectId}`, 'true');
        localStorage.setItem('participantQuestionsSaved', 'true');
      }
      
      // Show toasts if needed
      if (showToasts) {
        showValidationToasts(newCheckResults, true);
      }
      
      setIsCheckingQuestions(false);
      return hasStoryQuestion;
      
    } catch (error) {
      console.error("Error checking form components:", error);
      setIsCheckingQuestions(false);
      
      if (showToasts) {
        showErrorToast();
      }
      
      return false;
    }
  };

  return {
    checkResults,
    isCheckingQuestions,
    checkFormComponents
  };
};
