
import { useToast } from "@/components/ui/use-toast";
import { SliderTheme } from "@/components/design/defaultSliderThemes";
import { saveSliderQuestionsWithSync } from "@/services/designOutputService";
import { useProject } from "@/contexts/ProjectContext";

interface SliderQuestionSavingProps {
  setShowTip: (show: boolean) => void;
  setAllChangesSaved: (saved: boolean) => void;
  editedThemes: Map<number, SliderTheme>;
  setEditedThemes: (themes: Map<number, SliderTheme>) => void;
}

export const useSliderQuestionSaving = ({
  setShowTip,
  setAllChangesSaved,
  editedThemes,
  setEditedThemes
}: SliderQuestionSavingProps) => {
  const { toast } = useToast();
  const { activeProject } = useProject();

  const handleSaveAll = async (themes: SliderTheme[]) => {
    const projectId = activeProject?.id;
    
    if (!projectId) {
      console.warn("No active project ID found for saving slider questions");
      toast({
        title: "Save failed",
        description: "Could not find active project to save questions. Please refresh the page and try again.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      console.log("Saving slider themes:", themes);
      console.log("Project ID for saving:", projectId);
      
      // Force clear the cache before saving
      if (window && 'localStorage' in window) {
        localStorage.removeItem(`sliderThemesSaved_${projectId}`);
        localStorage.removeItem('sliderThemesSaved');
      }
      
      // Save to both localStorage and Supabase
      const saveResult = await saveSliderQuestionsWithSync(projectId, themes);
      
      if (!saveResult) {
        throw new Error("Save operation returned false");
      }
      
      toast({
        title: "All themes saved",
        description: `${editedThemes.size} theme(s) have been successfully saved.`,
      });
      
      // Hide the tip after saving all changes
      setShowTip(false);
      
      // Set the saved state to true
      setAllChangesSaved(true);
      
      // Store the saved state in localStorage
      localStorage.setItem('sliderThemesSaved', 'true');
      localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
      
      // Clear the edited themes tracking
      setEditedThemes(new Map());
      
      console.log(`Successfully saved ${themes.length} slider questions for project:`, projectId);
      
      // Trigger custom event to notify other components
      try {
        window.dispatchEvent(new CustomEvent('slider_questions_saved', {
          detail: { projectId, timestamp: Date.now() }
        }));
      } catch (e) {
        console.error("Error dispatching event:", e);
      }
      
      return true;
    } catch (error) {
      console.error("Error saving slider questions:", error);
      toast({
        title: "Save failed",
        description: "There was a problem saving your changes. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    handleSaveAll
  };
};
