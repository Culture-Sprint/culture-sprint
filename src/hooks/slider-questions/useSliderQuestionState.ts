
import { useState, useEffect } from "react";
import { SliderQuestion } from "@/services/types/designTypes";

/**
 * Type definitions for slider question state management
 */
interface SliderQuestionState {
  suggestedThemes: SliderQuestion[];
  editingThemeId: number | null;
  editedThemes: Map<number, SliderQuestion>;
  showTip: boolean;
  allChangesSaved: boolean;
  loading: boolean;
}

/**
 * Hook for managing slider questions state
 * @param projectId - The current project ID
 * @returns State and state setters for slider questions
 */
export const useSliderQuestionState = (projectId: string) => {
  // State for suggested themes
  const [suggestedThemes, setSuggestedThemes] = useState<SliderQuestion[]>([]);
  
  // State for tracking which theme is being edited
  const [editingThemeId, setEditingThemeId] = useState<number | null>(null);
  
  // State for tracking edited themes to be saved
  const [editedThemes, setEditedThemes] = useState<Map<number, SliderQuestion>>(new Map());
  
  // State for showing tip about saving changes
  const [showTip, setShowTip] = useState<boolean>(false);
  
  // State for tracking if all changes have been saved
  const [allChangesSaved, setAllChangesSaved] = useState<boolean>(false);
  
  // State for loading indicator
  const [loading, setLoading] = useState<boolean>(false);
  
  // Use useEffect to check for unsaved changes from localStorage
  // and to set the showTip state based on that
  useEffect(() => {
    if (!projectId) return;
    
    // Check for project-specific saved state first
    const projectSaved = localStorage.getItem(`sliderThemesSaved_${projectId}`);
    const globalSaved = localStorage.getItem('sliderThemesSaved');
    
    // If we have edited themes, always consider changes unsaved
    if (editedThemes.size > 0) {
      setAllChangesSaved(false);
      localStorage.setItem(`sliderThemesSaved_${projectId}`, 'false');
      localStorage.setItem('sliderThemesSaved', 'false');
      return;
    }
    
    if (projectSaved === 'true') {
      setAllChangesSaved(true);
    } else if (projectSaved === 'false') {
      setAllChangesSaved(false);
    } else if (globalSaved === 'true') {
      // Fall back to global saved state
      setAllChangesSaved(true);
      // Save project-specific state for future reference
      localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
    } else {
      setAllChangesSaved(false);
    }
    
    // Show the tip if there are no saved changes for this project
    if (!projectSaved && !globalSaved) {
      setShowTip(true);
    } else {
      setShowTip(false);
    }
  }, [projectId, editedThemes]);

  /**
   * Reset state when switching projects or initializing
   */
  const resetState = () => {
    setSuggestedThemes([]);
    setEditingThemeId(null);
    setEditedThemes(new Map());
    setShowTip(true);
    setAllChangesSaved(false);
    setLoading(false);
  };

  return {
    // State
    suggestedThemes,
    editingThemeId,
    editedThemes,
    showTip,
    allChangesSaved,
    loading,
    
    // State setters
    setSuggestedThemes,
    setEditingThemeId,
    setEditedThemes,
    setShowTip,
    setAllChangesSaved,
    setLoading,
    
    // Helper methods
    resetState
  };
};
