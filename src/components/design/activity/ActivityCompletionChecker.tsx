
import { isActivityComplete } from "@/types/activity";
import { ActivityFormData } from "@/types/activity";
import { useTemplateProject } from "@/hooks/projects/useTemplateProject";
import { useUserRole } from "@/hooks/useUserRole";

interface CompletionCheckerProps {
  activityId: string;
  activityData?: ActivityFormData;
  isTemplateProject?: boolean;
}

export const useActivityCompletionStatus = ({ activityId, activityData, isTemplateProject: incomingIsTemplateProject }: CompletionCheckerProps) => {
  const projectId = localStorage.getItem('activeProjectId');
  const { isTemplateOrClone } = useTemplateProject();
  const { isSuperUser } = useUserRole();
  
  // Combine passed prop with hook detection - either way works
  const isTemplateProject = incomingIsTemplateProject || (projectId ? isTemplateOrClone({ id: projectId || '' } as any) : false);
  
  // Check if this activity is completed using our utility function
  // If it's a template project, we should always show completed activities as completed
  // for all users, not just superusers
  const isCompleted = isTemplateProject || isActivityComplete(activityId, activityData);
  
  // Special case for form builder activity - check local storage directly
  const isFormBuilderCompleted = activityId === "form-builder" && 
    (localStorage.getItem('form-builder_completed') === 'true');

  // Determine if this is the story question activity
  const isStoryQuestionActivity = activityId === "story-questions";
  
  // For story question, we need to check if there's an actual saved question
  // rather than just relying on the activity completion flag
  const isStoryQuestionCompleted = isStoryQuestionActivity ? 
    (localStorage.getItem(`culturesprint_story_question_saved_${projectId}`) === 'true' || isTemplateProject) : 
    isCompleted;
    
  // Special handling for slider questions
  const isSliderQuestionsActivity = activityId === "slider-questions";
  const isSliderQuestionsCompleted = isSliderQuestionsActivity ?
    (localStorage.getItem(`sliderThemesSaved_${projectId}`) === 'true' || 
     localStorage.getItem('sliderThemesSaved') === 'true' ||
     isTemplateProject) :
    isCompleted;
    
  // Special handling for participant questions
  const isParticipantQuestionsActivity = activityId === "participant-questions";
  const isParticipantQuestionsCompleted = isParticipantQuestionsActivity ?
    (localStorage.getItem(`participantQuestionsSaved_${projectId}`) === 'true' || 
     localStorage.getItem('participantQuestionsSaved') === 'true' ||
     isTemplateProject) :
    isCompleted;
  
  // Determine final completion status based on activity type
  const finalCompletionStatus = 
    isStoryQuestionActivity ? isStoryQuestionCompleted :
    isSliderQuestionsActivity ? isSliderQuestionsCompleted :
    isParticipantQuestionsActivity ? isParticipantQuestionsCompleted :
    (isCompleted || isFormBuilderCompleted);

  return {
    isCompleted: finalCompletionStatus,
    isStoryQuestionActivity,
    isSliderQuestionsActivity,
    isParticipantQuestionsActivity,
    isTemplateProject
  };
};
