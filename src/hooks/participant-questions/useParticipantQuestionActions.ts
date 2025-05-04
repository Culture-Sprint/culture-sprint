
import { useCallback } from "react";
import { nanoid } from "nanoid";
import { ParticipantQuestion } from "@/services/types/designTypes";
import { saveParticipantQuestionsWithSync } from "@/services/designOutputService";
import { MultipleChoiceQuestion } from "@/components/design/multiple-choice/types";
import { useProject } from "@/contexts/ProjectContext";
import { Option } from "./useParticipantQuestionState";
import { useToast } from "@/components/ui/use-toast";

export interface ParticipantQuestionActionsProps {
  options: Option[];
  setOptions: (setter: (prev: Option[]) => Option[]) => void;
  otherOptions: Option[];
  setOtherOptions: (setter: (prev: Option[]) => Option[]) => void;
  newOption: string;
  setNewOption: (value: string) => void;
  setShowAddField: (show: boolean) => void;
  setIsDefiningChoices: (isDefining: boolean) => void;
  definedQuestions: MultipleChoiceQuestion[];
  setDefinedQuestions: (questions: MultipleChoiceQuestion[]) => void;
}

export const useParticipantQuestionActions = ({
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
}: ParticipantQuestionActionsProps) => {
  const { activeProject } = useProject();
  const { toast } = useToast();

  // Handler for toggling a default option
  const handleToggleOption = useCallback((id: string) => {
    setOptions(prevOptions => 
      prevOptions.map(option => 
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  }, [setOptions]);

  // Handler for toggling a custom option
  const handleToggleOtherOption = useCallback((id: string) => {
    setOtherOptions(prevOptions => 
      prevOptions.map(option => 
        option.id === id ? { ...option, checked: !option.checked } : option
      )
    );
  }, [setOtherOptions]);

  // Handler for adding a new custom option
  const handleAddOption = useCallback(() => {
    if (newOption.trim() === '') return;

    const newId = nanoid(8);
    setOtherOptions(prev => [
      ...prev, 
      { id: newId, label: newOption.trim(), checked: true, custom: true }
    ]);
    setNewOption('');
    setShowAddField(false);
  }, [newOption, setOtherOptions, setNewOption, setShowAddField]);

  // Handler for removing a custom option
  const handleRemoveOption = useCallback((id: string) => {
    setOtherOptions(prev => prev.filter(option => option.id !== id));
  }, [setOtherOptions]);

  // Get all selected options (both default and custom)
  const getSelectedOptions = useCallback(() => {
    return [
      ...options.filter(option => option.checked),
      ...otherOptions.filter(option => option.checked)
    ];
  }, [options, otherOptions]);

  // Handler for defining choices for selected options
  const handleDefineChoices = useCallback(() => {
    const selectedOptions = getSelectedOptions();
    if (selectedOptions.length === 0) {
      toast({
        title: "No Questions Selected",
        description: "Please select at least one question before defining choices.",
        variant: "destructive"
      });
      return;
    }
    setIsDefiningChoices(true);
  }, [getSelectedOptions, setIsDefiningChoices, toast]);

  // Handler for completing the choices definition
  const handleChoicesComplete = useCallback(async (updatedQuestions: MultipleChoiceQuestion[]) => {
    setDefinedQuestions(updatedQuestions);
    setIsDefiningChoices(false);
    
    if (!activeProject?.id) {
      console.error("No active project ID found for saving participant questions");
      return;
    }
    
    try {
      // Convert to ParticipantQuestion format
      const participantQuestions: ParticipantQuestion[] = updatedQuestions.map(q => ({
        id: q.id,
        label: q.label,
        checked: true,
        choices: q.choices
      }));
      
      console.log("Saving participant questions:", participantQuestions);
      
      // Save to database
      const success = await saveParticipantQuestionsWithSync(activeProject.id, participantQuestions);
      
      if (success) {
        // Set localStorage flag to indicate participant questions are saved
        localStorage.setItem('participantQuestionsSaved', 'true');
        localStorage.setItem(`participantQuestionsSaved_${activeProject.id}`, 'true');
        
        toast({
          title: "Success",
          description: "Participant questions saved successfully",
          variant: "default"
        });
      } else {
        throw new Error("Failed to save participant questions");
      }
    } catch (error) {
      console.error("Error saving participant questions:", error);
      toast({
        title: "Error",
        description: "Failed to save participant questions",
        variant: "destructive"
      });
    }
  }, [activeProject, setDefinedQuestions, setIsDefiningChoices, toast]);

  return {
    handleToggleOption,
    handleToggleOtherOption,
    handleAddOption,
    handleRemoveOption,
    getSelectedOptions,
    handleDefineChoices,
    handleChoicesComplete
  };
};
