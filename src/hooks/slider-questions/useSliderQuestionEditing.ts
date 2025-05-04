
import { useToast } from "@/hooks/toast";
import { SliderTheme } from "@/components/design/defaultSliderThemes";

interface SliderQuestionEditingProps {
  suggestedThemes: SliderTheme[];
  setSuggestedThemes: (themes: SliderTheme[]) => void;
  setEditingThemeId: (id: number | null) => void;
  editedThemes: Map<number, SliderTheme>;
  setEditedThemes: (themes: Map<number, SliderTheme>) => void;
  setAllChangesSaved: (saved: boolean) => void;
}

export const useSliderQuestionEditing = ({
  suggestedThemes,
  setSuggestedThemes,
  setEditingThemeId,
  editedThemes,
  setEditedThemes,
  setAllChangesSaved
}: SliderQuestionEditingProps) => {
  const { toast } = useToast();

  const handleEditTheme = (id: number) => {
    setEditingThemeId(id);
    setAllChangesSaved(false);
    // Also update localStorage to reflect the unsaved state
    localStorage.setItem('sliderThemesSaved', 'false');
  };

  // Updated signature to match what ThemePolarity expects
  const handleSaveTheme = (id: number, theme: string, question: string, leftLabel: string, rightLabel: string, sliderValue?: number) => {
    const updatedTheme = { 
      id, 
      theme, 
      question, 
      leftLabel, 
      rightLabel,
      sliderValue: sliderValue || 50 // Default to 50 if not provided
    };
    
    // Update the main state
    const updatedThemes = suggestedThemes.map((item) => 
      item.id === id ? updatedTheme : item
    );
    
    setSuggestedThemes(updatedThemes);
    
    // Add to edited themes map to track changes
    setEditedThemes(new Map(editedThemes.set(id, updatedTheme)));
    setEditingThemeId(null);
    setAllChangesSaved(false);
    // Update localStorage to reflect the unsaved state
    localStorage.setItem('sliderThemesSaved', 'false');
    
    toast({
      title: "Theme updated",
      description: `The "${theme}" theme has been updated successfully.`,
    });
  };

  const handleCancelEdit = () => {
    setEditingThemeId(null);
  };

  return {
    handleEditTheme,
    handleSaveTheme,
    handleCancelEdit
  };
};
