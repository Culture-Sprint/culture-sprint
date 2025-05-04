
import { useState, useEffect, useRef } from "react";
import { MultipleChoiceQuestion } from "@/components/design/multiple-choice/types";
import { getParticipantQuestionsFromService } from "@/services/participantQuestionsService";
import { useProject } from "@/contexts/ProjectContext";

export interface Option {
  id: string;
  label: string;
  checked: boolean;
  custom?: boolean;
}

export const useParticipantQuestionState = () => {
  const { activeProject } = useProject();
  const [options, setOptions] = useState<Option[]>([
    { id: "gender", label: "Gender", checked: false },
    { id: "payGrade", label: "Pay grade", checked: false },
    { id: "placeOfWork", label: "Place of work", checked: false },
  ]);
  
  const [otherOptions, setOtherOptions] = useState<Option[]>([]);
  const [newOption, setNewOption] = useState("");
  const [showAddField, setShowAddField] = useState(false);
  const [isDefiningChoices, setIsDefiningChoices] = useState(false);
  const [definedQuestions, setDefinedQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [previousProjectId, setPreviousProjectId] = useState<string | null>(null);
  const hasInitializedRef = useRef<{[key: string]: boolean}>({});

  // Load saved questions from storage when activeProject changes
  useEffect(() => {
    if (!activeProject?.id) return;
    
    // Clear cache when switching projects
    if (previousProjectId && previousProjectId !== activeProject.id) {
      console.log(`Project changed from ${previousProjectId} to ${activeProject.id}, clearing participant question state`);
      
      // Reset state
      setDefinedQuestions([]);
      setOptions(prevOptions => prevOptions.map(option => ({ ...option, checked: false })));
      setOtherOptions([]);
      
      // Clear cache for previous project
      try {
        localStorage.removeItem(`culturesprint_participant_questions_${previousProjectId}`);
        localStorage.removeItem(`participantQuestionsSaved_${previousProjectId}`);
        sessionStorage.removeItem(`ar_cache_${previousProjectId}_design_form-questions_participant-questions`);
        sessionStorage.removeItem(`ar_cache_${previousProjectId}_collection_form-questions_participant-questions`);
        
        // Reset initialization flag
        hasInitializedRef.current = {};
      } catch (e) {
        console.error("Error clearing participant questions cache:", e);
      }
    }
    
    setPreviousProjectId(activeProject.id);
    
    // Skip if we've already initialized this project
    if (hasInitializedRef.current[activeProject.id]) {
      return;
    }
    
    try {
      // Use our service to get saved participant questions with the active project ID
      const savedQuestions = getParticipantQuestionsFromService(activeProject.id);
      if (savedQuestions && savedQuestions.length > 0) {
        console.log("Loaded participant questions from service for project:", activeProject.id, savedQuestions);
        setDefinedQuestions(savedQuestions);
        
        // Update checked state for options that have definitions
        const questionIds = savedQuestions.map((q) => q.id);
        
        setOptions(prevOptions => 
          prevOptions.map(option => ({
            ...option,
            checked: questionIds.includes(option.id)
          }))
        );
        
        // Update other options too - rebuild the entire other options array
        const defaultOptionIds = options.map(o => o.id);
        
        // Find all questions that aren't in default options
        const newOtherOptions = savedQuestions
          .filter(q => !defaultOptionIds.includes(q.id))
          .map(q => ({
            id: q.id,
            label: q.label,
            checked: true
          }));
        
        setOtherOptions(newOtherOptions);
      } else {
        console.log("No participant questions found in service for project:", activeProject.id);
        
        // Reset state for new project
        setOptions(prevOptions => prevOptions.map(option => ({ ...option, checked: false })));
        setOtherOptions([]);
        setDefinedQuestions([]);
      }
      
      // Mark this project as initialized
      hasInitializedRef.current[activeProject.id] = true;
    } catch (error) {
      console.error("Error loading participant questions:", error);
    }
  }, [activeProject?.id]); 

  return {
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
  };
};
