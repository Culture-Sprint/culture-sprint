
// Extend existing types file with our new types

export interface ActivityFormData {
  [key: string]: string;
}

export interface QuestionField {
  id: string;
  label: string;
  isTextarea?: boolean;
}

// Helper functions for activity completion check
export const isActivityComplete = (
  activityId: string,
  activityData?: ActivityFormData
): boolean => {
  // Special case for the form-builder activity
  if (activityId === "form-builder") {
    return localStorage.getItem('form-builder_completed') === 'true';
  }
  
  // Special case for story-questions activity
  if (activityId === "story-questions") {
    // Check if the story question has been saved using localStorage
    // This only returns true if there's actually a question saved to the database
    const projectId = localStorage.getItem('activeProjectId');
    return projectId ? localStorage.getItem(`culturesprint_story_question_saved_${projectId}`) === 'true' : false;
  }
  
  // Special case for slider-questions activity
  if (activityId === "slider-questions") {
    const projectId = localStorage.getItem('activeProjectId');
    // Check both project-specific and general flags (for backward compatibility)
    return projectId ? 
      (localStorage.getItem(`sliderThemesSaved_${projectId}`) === 'true' || localStorage.getItem('sliderThemesSaved') === 'true') : 
      localStorage.getItem('sliderThemesSaved') === 'true';
  }
  
  // Special case for participant-questions activity
  if (activityId === "participant-questions") {
    const projectId = localStorage.getItem('activeProjectId');
    
    // First check the localStorage flag
    const isSaved = projectId ? 
      (localStorage.getItem(`participantQuestionsSaved_${projectId}`) === 'true' || localStorage.getItem('participantQuestionsSaved') === 'true') : 
      localStorage.getItem('participantQuestionsSaved') === 'true';
    
    if (isSaved) {
      return true;
    }
    
    // If the flag isn't set but we have activity data, also consider it complete
    // This handles cases where the questions were saved but the flag wasn't set
    if (activityData && typeof activityData === 'object') {
      const keys = Object.keys(activityData);
      return keys.length > 0 && Object.values(activityData).some(value => value && value.trim() !== '');
    }
    
    return false;
  }
  
  // For regular activities, check if there's activity data with content
  return Boolean(
    activityData && 
    Object.keys(activityData).length > 0 && 
    Object.values(activityData).some(value => value && value.trim() !== '')
  );
};

// Find the first incomplete activity in a list
export const findFirstIncompleteActivity = (
  activities: Array<{ id: string; title: string; description: string }>,
  activityData: {[key: string]: ActivityFormData}
) => {
  return activities.find(activity => !isActivityComplete(activity.id, activityData[activity.id]));
};
