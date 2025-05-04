
import { useState } from "react";
import { saveStoryQuestionWithSync } from "@/services/designOutputService";
import { toast } from "@/components/ui/use-toast";

interface UseStoryQuestionActionsProps {
  projectId?: string;
  savedQuestion: string | null;
  setSavedQuestion: (question: string | null) => void;
  setCurrentQuestion: (question: string | null) => void;
  setIsEditing: (isEditing: boolean) => void;
  setHasEverSavedQuestion: (hasEverSaved: boolean) => void;
}

export const useStoryQuestionActions = (props: UseStoryQuestionActionsProps | string) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle both types of arguments (string or object)
  const projectId = typeof props === 'string' ? props : props.projectId;

  // Save story question to the database
  const saveStoryQuestion = async (question: string): Promise<boolean> => {
    if (!projectId) {
      console.error("Cannot save story question: No project ID provided");
      toast({
        title: "Save failed",
        description: "No project selected. Please select a project first.",
        variant: "destructive"
      });
      return false;
    }

    setIsSaving(true);

    try {
      await saveStoryQuestionWithSync(projectId, question);
      console.log("Story question saved successfully");
      return true;
    } catch (error) {
      console.error("Error saving story question:", error);
      toast({
        title: "Save failed",
        description: "Failed to save story question. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle saving the question (for object-style props)
  const handleSaveQuestion = async (question: string): Promise<void> => {
    if (typeof props !== 'string') {
      const success = await saveStoryQuestion(question);
      
      if (success) {
        props.setSavedQuestion(question);
        props.setCurrentQuestion(question);
        props.setIsEditing(false);
        props.setHasEverSavedQuestion(true);
        
        toast({
          title: "Question saved",
          description: "Your story question has been saved successfully.",
        });
      }
    } else {
      await saveStoryQuestion(question);
    }
  };
  
  // Handle edit question action (for object-style props)
  const handleEditQuestion = () => {
    if (typeof props !== 'string') {
      props.setIsEditing(true);
    }
  };

  // Return appropriate functions based on props type
  if (typeof props === 'string') {
    return {
      saveStoryQuestion,
      isSaving
    };
  } else {
    return {
      saveStoryQuestion,
      handleSaveQuestion,
      handleEditQuestion,
      isSaving
    };
  }
};
