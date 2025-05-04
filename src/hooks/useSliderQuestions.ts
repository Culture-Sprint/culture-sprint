
import { useCallback, useEffect, useRef } from "react";
import { SliderQuestion } from "@/services/types/designTypes";
import { useFactorBasedQuestions } from "./slider-questions/useFactorBasedQuestions";
import { useSliderQuestionFetch } from "./slider-questions/useSliderQuestionFetch";
import { useSliderQuestionEdit } from "./slider-questions/useSliderQuestionEdit";
import { useSliderQuestionSave } from "./slider-questions/useSliderQuestionSave";
import { useSliderQuestionState } from "./slider-questions/useSliderQuestionState";
import { useSliderQuestionRefresh } from "./slider-questions/useSliderQuestionRefresh";
import { useDebugInfo } from "./slider-questions/useDebugInfo";

export const useSliderQuestions = (projectId: string, isTemplateProject: boolean = false) => {
  const initialFetchDone = useRef(false);
  const lastProjectId = useRef<string | null>(null);

  // Use the state management hook
  const {
    suggestedThemes,
    setSuggestedThemes,
    editingThemeId,
    setEditingThemeId,
    editedThemes,
    setEditedThemes,
    showTip,
    setShowTip,
    allChangesSaved,
    setAllChangesSaved,
    loading,
    setLoading,
    resetState
  } = useSliderQuestionState(projectId);

  // Use the focused hooks
  const { fetchSliderQuestions, refreshThemes, isFetching } = useSliderQuestionFetch(projectId, isTemplateProject);
  
  const { 
    handleEditTheme: editHandleEditTheme,
    handleSaveTheme: editHandleSaveTheme, 
    handleCancelEdit: editHandleCancelEdit 
  } = useSliderQuestionEdit();
  
  const {
    handleSaveAll: saveHandleSaveAll,
    setAllChangesSaved: setSavedState
  } = useSliderQuestionSave(projectId);

  // Use the factor-based questions hook
  const factorBasedQuestions = useFactorBasedQuestions({
    projectId,
    setSuggestedThemes,
    setEditedThemes,
    setAllChangesSaved
  });

  // Use the refresh hook
  const { isRefreshing, handleRefreshThemes } = useSliderQuestionRefresh(
    projectId,
    fetchSliderQuestions,
    setSuggestedThemes,
    setAllChangesSaved,
    setLoading
  );

  // Use the debug info hook
  const { lastDebugInfo, setLastDebugInfo } = useDebugInfo(factorBasedQuestions.lastDebugInfo);

  // Reset initialFetchDone when projectId changes to ensure questions are loaded for the new project
  useEffect(() => {
    if (projectId && lastProjectId.current !== projectId) {
      console.log(`Project ID changed from ${lastProjectId.current} to ${projectId}, resetting slider questions state`);
      initialFetchDone.current = false;
      lastProjectId.current = projectId;
      
      // Reset state when project changes
      resetState();
    }
  }, [projectId, resetState]);

  // Fetch slider questions when projectId changes or when not fetched yet
  useEffect(() => {
    if (projectId && !initialFetchDone.current && !isRefreshing) {
      console.log("Initial fetch of slider questions for project:", projectId, "isTemplate:", isTemplateProject);
      setLoading(true);
      
      fetchSliderQuestions()
        .then(questions => {
          setSuggestedThemes(questions);
          initialFetchDone.current = true;
          
          // Update saved state based on the result
          if (questions && questions.length > 0) {
            setAllChangesSaved(true);
            localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
          } else {
            setAllChangesSaved(false);
            localStorage.removeItem(`sliderThemesSaved_${projectId}`);
          }
        })
        .catch(error => {
          console.error("Error fetching slider questions:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [projectId, fetchSliderQuestions, setSuggestedThemes, setLoading, isRefreshing, setAllChangesSaved, isTemplateProject]);

  // Implement handleEditTheme adapter
  const handleEditTheme = useCallback((id: number) => {
    console.log("Editing theme with ID:", id);
    setEditingThemeId(id);
    // Force clear the saved state when editing begins
    setAllChangesSaved(false);
    localStorage.setItem('sliderThemesSaved', 'false');
    if (projectId) {
      localStorage.setItem(`sliderThemesSaved_${projectId}`, 'false');
    }
    return editHandleEditTheme(id);
  }, [setEditingThemeId, editHandleEditTheme, setAllChangesSaved, projectId]);

  // Adapter for handleSaveTheme to update suggestedThemes
  const handleSaveTheme = useCallback((id: number, themeOrThemeObject: string | SliderQuestion, question?: string, leftLabel?: string, rightLabel?: string, sliderValue?: number) => {
    const updatedTheme = editHandleSaveTheme(id, themeOrThemeObject, question, leftLabel, rightLabel, sliderValue);
    
    console.log("Saving theme:", updatedTheme);
    
    setSuggestedThemes(prevThemes => 
      prevThemes.map(theme => theme.id === id ? updatedTheme : theme)
    );
    
    // Add to the edited themes Map to track changes
    setEditedThemes(prevMap => {
      const newMap = new Map(prevMap);
      newMap.set(id, updatedTheme);
      return newMap;
    });
    
    // Reset editing state
    setEditingThemeId(null);
    
    // Important: Set allChangesSaved to false when any edit is made
    setAllChangesSaved(false);
    localStorage.setItem('sliderThemesSaved', 'false');
    if (projectId) {
      localStorage.setItem(`sliderThemesSaved_${projectId}`, 'false');
    }
    
    console.log("Current edited themes count:", editedThemes.size + 1);
    
    return updatedTheme;
  }, [editHandleSaveTheme, setSuggestedThemes, setEditedThemes, setEditingThemeId, setAllChangesSaved, editedThemes, projectId]);

  // Implement handleCancelEdit adapter
  const handleCancelEdit = useCallback(() => {
    editHandleCancelEdit();
    setEditingThemeId(null);
  }, [editHandleCancelEdit, setEditingThemeId]);

  // Adapter for handleSaveAll
  const handleSaveAll = useCallback(async () => {
    console.log("Saving all themes to database...");
    console.log("Current themes:", suggestedThemes);
    console.log("Edited themes:", Array.from(editedThemes.entries()));
    
    // Force clear the saved state before saving
    setAllChangesSaved(false);
    
    const success = await saveHandleSaveAll(suggestedThemes, editedThemes);
    
    if (success) {
      // Clear edited themes after successful save
      setEditedThemes(new Map());
      setAllChangesSaved(true);
      
      // Set the project-specific saved flag
      if (projectId) {
        localStorage.setItem(`sliderThemesSaved_${projectId}`, 'true');
      }
      localStorage.setItem('sliderThemesSaved', 'true');
      
      console.log("Successfully saved all themes to database");
    } else {
      console.error("Failed to save all themes to database");
      // Ensure saved state is false on failure
      setAllChangesSaved(false);
      localStorage.setItem('sliderThemesSaved', 'false');
      if (projectId) {
        localStorage.setItem(`sliderThemesSaved_${projectId}`, 'false');
      }
    }
    
    return success;
  }, [suggestedThemes, editedThemes, saveHandleSaveAll, setEditedThemes, setAllChangesSaved, projectId]);

  const generateFactorBasedQuestionsWithDebug = useCallback(async () => {
    const result = await factorBasedQuestions.generateFactorBasedQuestions();
    if (result?.debugInfo) {
      setLastDebugInfo(result.debugInfo);
    }
    return result;
  }, [factorBasedQuestions, setLastDebugInfo]);

  return {
    suggestedThemes,
    setSuggestedThemes,
    editingThemeId,
    editedThemes,
    showTip,
    allChangesSaved,
    loading: loading || factorBasedQuestions.loading || isRefreshing || isFetching(),
    isRefreshing,
    lastDebugInfo,
    handleEditTheme,
    handleSaveTheme,
    handleCancelEdit,
    handleSaveAll,
    generateFactorBasedQuestions: generateFactorBasedQuestionsWithDebug,
    refreshThemes: handleRefreshThemes
  };
};
