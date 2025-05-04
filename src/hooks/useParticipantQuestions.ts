
import { useState, useEffect, useCallback } from "react";
import { useParticipantQuestionState, Option } from "./participant-questions/useParticipantQuestionState";
import { useParticipantQuestionFetch } from "./participant-questions/useParticipantQuestionFetch";
import { useParticipantQuestionActions } from "./participant-questions/useParticipantQuestionActions";
import { useProject } from "@/contexts/ProjectContext";

// Export the Option type for use in other components
export type { Option } from "./participant-questions/useParticipantQuestionState";

export const useParticipantQuestions = () => {
  const { activeProject } = useProject();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  
  const {
    options,
    setOptions,
    otherOptions,
    setOtherOptions,
    newOption,
    setNewOption,
    showAddField,
    setShowAddField,
    isDefiningChoices,
    setIsDefiningChoices,
    definedQuestions,
    setDefinedQuestions
  } = useParticipantQuestionState();

  const { 
    fetchParticipantQuestions,
    refreshParticipantQuestions,
    isFetchingRef 
  } = useParticipantQuestionFetch({
    setDefinedQuestions,
    setOptions,
    setOtherOptions,
    options
  });

  const {
    handleToggleOption,
    handleToggleOtherOption,
    handleAddOption,
    handleRemoveOption,
    getSelectedOptions,
    handleDefineChoices,
    handleChoicesComplete
  } = useParticipantQuestionActions({
    options,
    setOptions,
    otherOptions,
    setOtherOptions,
    newOption,
    setNewOption,
    setShowAddField,
    setIsDefiningChoices,
    definedQuestions,
    setDefinedQuestions
  });

  // Memoize the fetch function to prevent it from being recreated on every render
  const fetchQuestionsOnce = useCallback(async () => {
    if (!activeProject?.id || hasInitialLoad || isFetchingRef.current) {
      return;
    }

    setIsLoading(true);
    console.log("useParticipantQuestions: Initial load for project", activeProject.id);
    
    try {
      await fetchParticipantQuestions();
      setHasInitialLoad(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeProject?.id, hasInitialLoad, fetchParticipantQuestions, isFetchingRef]);

  // Only fetch participant questions once when component mounts or when project changes
  useEffect(() => {
    if (activeProject?.id) {
      // Reset the hasInitialLoad state when project changes
      if (hasInitialLoad && activeProject.id !== localStorage.getItem('lastLoadedProjectId')) {
        setHasInitialLoad(false);
      }
      
      fetchQuestionsOnce();
      localStorage.setItem('lastLoadedProjectId', activeProject.id);
    } else {
      setIsLoading(false);
    }
  }, [activeProject?.id, fetchQuestionsOnce, hasInitialLoad]);

  const refreshQuestions = async () => {
    if (activeProject?.id && !isRefreshing && !isFetchingRef.current) {
      setIsRefreshing(true);
      console.log("useParticipantQuestions: Manual refresh requested for project", activeProject.id);
      
      try {
        await refreshParticipantQuestions();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  return {
    options,
    otherOptions,
    newOption,
    setNewOption,
    showAddField,
    setShowAddField,
    isDefiningChoices,
    definedQuestions,
    isLoading,
    isRefreshing,
    handleToggleOption,
    handleToggleOtherOption,
    handleAddOption,
    handleRemoveOption,
    handleDefineChoices,
    handleChoicesComplete,
    getSelectedOptions,
    refreshQuestions
  };
};
