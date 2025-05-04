
import React, { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useProject } from "@/contexts/ProjectContext";
import { useActivityResponses } from "@/hooks/useActivityResponses";
import StoryQuestionImprover from "../StoryQuestionImprover";
import SaveQuestionButton from "./SaveQuestionButton";
import SavedQuestionIndicator from "./SavedQuestionIndicator";

interface ImprovementSectionProps {
  displayQuestion: string;
  questionSaved: boolean;
  onAcceptImprovement: (question: string, savedToDb?: boolean) => void;
  onSaveQuestion?: (question: string) => void;
}

const ImprovementSection: React.FC<ImprovementSectionProps> = ({
  displayQuestion,
  questionSaved,
  onAcceptImprovement,
  onSaveQuestion
}) => {
  const [saveLoading, setSaveLoading] = useState(false);
  const { activeProject } = useProject();

  const handleSaveQuestion = async () => {
    if (!activeProject?.id) {
      toast({
        title: "Error",
        description: "No active project selected",
        variant: "destructive",
      });
      return;
    }

    setSaveLoading(true);
    
    try {
      console.log("Saving question via ImprovementSection:", displayQuestion);
      
      // Call the parent's onSaveQuestion callback which will handle all the saving logic
      if (onSaveQuestion) {
        await onSaveQuestion(displayQuestion);
        
        // Call onAcceptImprovement with savedToDb=true to update UI state
        onAcceptImprovement(displayQuestion, true);
      }
      
      toast({
        title: "Success",
        description: "Story question saved successfully",
      });
    } catch (error) {
      console.error("Failed to save question:", error);
      toast({
        title: "Error",
        description: "Failed to save the question",
        variant: "destructive",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="bg-green-50 p-4 rounded-md border border-green-100 mt-2">
      <StoryQuestionImprover 
        initialQuestion={displayQuestion} 
        onAcceptImprovement={onAcceptImprovement}
      />
      
      <SaveQuestionButton 
        saved={questionSaved}
        loading={saveLoading}
        onSave={handleSaveQuestion}
      />
      
      <SavedQuestionIndicator saved={questionSaved} />
    </div>
  );
};

export default ImprovementSection;
