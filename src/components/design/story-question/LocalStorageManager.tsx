
import { useEffect } from "react";
import { useStoryQuestionContext } from "./StoryQuestionContext";

const LocalStorageManager = () => {
  const { projectId, savedQuestion } = useStoryQuestionContext();

  // Set local storage flag when the question is saved
  useEffect(() => {
    if (projectId && savedQuestion) {
      try {
        console.log("Setting local storage flag for saved question:", savedQuestion);
        // Set active project ID in localStorage for the activity completion check
        localStorage.setItem('activeProjectId', projectId);
        localStorage.setItem(`culturesprint_story_question_saved_${projectId}`, 'true');
      } catch (error) {
        console.error("Error setting localStorage flag:", error);
      }
    }
  }, [projectId, savedQuestion]);

  return null; // This is a utility component with no UI
};

export default LocalStorageManager;
