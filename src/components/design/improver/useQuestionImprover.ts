
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useActivityResponses } from "@/hooks/activity"; // Use the full hook with all methods
import { useProject } from "@/contexts/ProjectContext";
import { processAIResponse } from "./questionUtils";
import { saveStoryQuestionWithSync } from "@/services/designOutputService";

interface UseQuestionImproverProps {
  initialQuestion: string;
  onAcceptImprovement?: (improvedQuestion: string, savedToDb?: boolean) => void;
}

export const useQuestionImprover = ({
  initialQuestion,
  onAcceptImprovement
}: UseQuestionImproverProps) => {
  const [improvementPrompt, setImprovementPrompt] = useState("");
  const [localQuestion, setLocalQuestion] = useState(initialQuestion);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const { activeProject } = useProject();
  const { saveActivityResponse } = useActivityResponses(activeProject?.id || '');

  // Update local question when initialQuestion prop changes
  useEffect(() => {
    console.log("useQuestionImprover received new initialQuestion:", initialQuestion);
    
    // Process and clean the question
    const cleanQuestion = processAIResponse(initialQuestion);
    setLocalQuestion(cleanQuestion);
    
    // Reset the improvement prompt when initial question changes
    setImprovementPrompt("");
  }, [initialQuestion]);

  const handleImprovementPrompt = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImprovementPrompt(e.target.value);
  };

  const handleAcceptImprovement = async (response: string) => {
    if (!response || !onAcceptImprovement) return;
    
    // Show loading state immediately
    setAcceptLoading(true);
    
    try {
      // Clean and process the question
      const extractedQuestion = processAIResponse(response);
      
      console.log("handleAcceptImprovement - extracted question:", extractedQuestion);
      
      // Update the local question immediately to provide visual feedback
      setLocalQuestion(extractedQuestion);
      
      // Show acceptance feedback right away
      toast({
        title: "Accepting improvement",
        description: "Processing your request...",
      });

      // First update the parent component to ensure UI updates immediately
      onAcceptImprovement(extractedQuestion, false);

      // Then try to save to database in background
      if (activeProject?.id) {
        try {
          console.log("Saving improved question to database:", extractedQuestion);
          
          // Save to consolidated activity ID
          const success = await saveActivityResponse(
            'collection', // phase_id
            'story-questions', // step_id
            'story-questions', // activity_id - consolidated 
            { 
              question: extractedQuestion,
              selected_at: new Date().toISOString()
            }
          );
          
          // Also save with the sync service for better cross-service consistency
          const syncSuccess = await saveStoryQuestionWithSync(activeProject.id, extractedQuestion);

          if (success || syncSuccess) {
            // Update the parent component with saved status
            onAcceptImprovement(extractedQuestion, true);
            
            toast({
              title: "Success",
              description: "Improved question saved as the permanent story question",
            });
          } 
        } catch (error) {
          console.error("Failed to save improved question:", error);
          toast({
            title: "Warning",
            description: "Question updated but not saved to database",
            variant: "destructive"
          });
        }
      } else {
        // No project selected, just update the display
        toast({
          title: "Warning",
          description: "No project selected, changes not saved",
          variant: "destructive"
        });
      }
      
      // Clear the improvement prompt
      setImprovementPrompt("");
    } catch (error) {
      console.error("Error processing improvement:", error);
      toast({
        title: "Error",
        description: "Failed to process the improvement",
        variant: "destructive"
      });
    } finally {
      setAcceptLoading(false);
    }
  };

  // Create optimized prompt for faster AI response
  const createImprovedQuestionPrompt = (question: string, direction: string): string => {
    // Make the prompt more direct and focused to get faster responses
    return `Improve this story question: "${question}". Direction: ${direction}. Respond with ONLY the improved question. No explanations.`;
  };

  return {
    improvementPrompt,
    localQuestion,
    acceptLoading,
    handleImprovementPrompt,
    handleAcceptImprovement,
    createImprovedQuestionPrompt,
    setImprovementPrompt
  };
};
