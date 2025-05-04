import { useStoryQuestionContext } from "./StoryQuestionContext";
import { clearFormCache } from "@/hooks/collect/form-fetch/formDataCache";
import { toast } from "@/components/ui/use-toast";

interface StoryQuestionActionsProps {
  handleAcceptImprovement: (newQuestion: string, savedToDb?: boolean) => void;
}

const StoryQuestionActions = ({ 
  handleAcceptImprovement 
}: StoryQuestionActionsProps) => {
  const { 
    projectId, 
    setIsEditing, 
    handleSaveQuestion 
  } = useStoryQuestionContext();

  const acceptImprovement = async (newQuestion: string, savedToDb?: boolean) => {
    if (savedToDb) {
      // If already saved to DB, update the UI state and show confirmation
      setIsEditing(false);
      toast({
        title: "Question Saved",
        description: "The improved question has been saved as your story question.",
      });
      
      // Clear the cache to ensure the new question is used everywhere
      if (projectId) {
        const cacheKey = `form_data_${projectId}`;
        clearFormCache(cacheKey);
      }
    } else {
      // Otherwise, save the improved question to the database
      handleSaveQuestion(newQuestion)
        .then(() => {
          setIsEditing(false);
        })
        .catch((error) => {
          console.error("Error saving improved question:", error);
        });
    }
  };

  return { handleAcceptImprovement: acceptImprovement };
};

export default StoryQuestionActions;
