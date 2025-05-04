
import { useCallback } from "react";
import { SliderQuestion } from "@/services/types/designTypes";
import { saveSliderQuestionsWithSync } from "@/services/designOutputService";
import { useToast } from "@/components/ui/use-toast";

export const useSliderQuestionSave = (projectId: string) => {
  const { toast } = useToast();
  
  // Function to handle saving all themes
  const handleSaveAll = useCallback(
    async (
      suggestedThemes: SliderQuestion[],
      editedThemes: Map<number, SliderQuestion>
    ): Promise<boolean> => {
      console.log("Saving all slider questions for project:", projectId);
      
      if (!projectId) {
        console.error("No project ID provided for saving slider questions");
        
        toast({
          title: "Error",
          description: "Unable to save slider questions. No project selected.",
          variant: "destructive"
        });
        
        return false;
      }
      
      try {
        // Create a copy of the suggested themes
        const themesToSave: SliderQuestion[] = [...suggestedThemes];
        
        // Update any edited themes
        editedThemes.forEach((editedTheme) => {
          const index = themesToSave.findIndex((t) => t.id === editedTheme.id);
          if (index !== -1) {
            themesToSave[index] = editedTheme;
          }
        });
        
        console.log("Saving themes to database:", themesToSave);
        
        // Save the themes to the database using the sync service
        const success = await saveSliderQuestionsWithSync(projectId, themesToSave);
        
        if (success) {
          // Show success toast
          toast({
            title: "Success",
            description: "Slider questions saved successfully.",
            variant: "default"
          });
          
          return true;
        } else {
          throw new Error("Failed to save slider questions");
        }
      } catch (error) {
        console.error("Error saving slider questions:", error);
        
        // Show error toast
        toast({
          title: "Error",
          description: "Failed to save slider questions. Please try again.",
          variant: "destructive"
        });
        
        return false;
      }
    },
    [projectId, toast]
  );
  
  // Function to set all changes saved
  const setAllChangesSaved = useCallback((saved: boolean) => {
    if (saved) {
      localStorage.setItem("sliderThemesSaved", "true");
      if (projectId) {
        localStorage.setItem(`sliderThemesSaved_${projectId}`, "true");
      }
    } else {
      localStorage.removeItem("sliderThemesSaved");
      if (projectId) {
        localStorage.removeItem(`sliderThemesSaved_${projectId}`);
      }
    }
  }, [projectId]);
  
  return {
    handleSaveAll,
    setAllChangesSaved
  };
};
