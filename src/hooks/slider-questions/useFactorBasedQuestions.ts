
import { useState, useCallback } from 'react';
import { SliderQuestion } from '@/services/types/designTypes';
import { generateWithAI, getLastDebugInfo, AIDebugInfo } from './sliderQuestionAIGenerator';
import { useInfluencingFactors } from '@/services/factors/useInfluencingFactors';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from '@/components/ui/use-toast';

interface UseFactorBasedQuestionsProps {
  projectId: string;
  setSuggestedThemes: (themes: SliderQuestion[]) => void;
  setEditedThemes: (editedThemes: Map<number, SliderQuestion>) => void;
  setAllChangesSaved: (saved: boolean) => void;
}

export const useFactorBasedQuestions = ({
  projectId,
  setSuggestedThemes,
  setEditedThemes,
  setAllChangesSaved
}: UseFactorBasedQuestionsProps) => {
  const [loading, setLoading] = useState(false);
  const [lastDebugInfo, setLocalDebugInfo] = useState<AIDebugInfo | null>(null);
  const { activeProject } = useProject();
  const { getInfluencingFactors, isLoading: factorsLoading } = useInfluencingFactors(projectId);

  const generateFactorBasedQuestions = useCallback(async () => {
    console.log("Generating factor-based questions for project:", projectId);
    
    if (!projectId) {
      console.error("No project ID provided for generating factor-based questions");
      return { success: false, factorsMissing: true };
    }
    
    setLoading(true);
    
    try {
      // Fetch project factors using the dedicated hook
      const factors = await getInfluencingFactors();
      
      if (!factors || factors.length === 0) {
        console.log("No factors found for this project");
        toast({
          title: "No factors found",
          description: "Please define influencing factors in the Define phase first.",
          variant: "destructive",
        });
        return { success: false, factorsMissing: true };
      }
      
      console.log("Factors found:", factors);
      
      // Generate slider questions based on factors using the AI generator
      const generatedQuestions = await generateWithAI(factors, activeProject);
      
      if (!generatedQuestions || generatedQuestions.length === 0) {
        console.log("No questions were generated");
        toast({
          title: "Generation failed",
          description: "Couldn't generate slider questions. Please try again.",
          variant: "destructive",
        });
        return { success: false, factorsMissing: false };
      }
      
      console.log("Generated questions:", generatedQuestions);
      
      // Ensure we have 3 questions by duplicating if needed
      let finalQuestions = [...generatedQuestions];
      while (finalQuestions.length < 3) {
        const template = generatedQuestions[0];
        if (template) {
          const newQuestion = {
            ...template,
            id: finalQuestions.length + 1,
            theme: `${template.theme} ${finalQuestions.length + 1}`,
            question: `${template.question} (Additional version ${finalQuestions.length + 1})`,
          };
          finalQuestions.push(newQuestion);
        } else {
          break;
        }
      }
      
      // Update the suggested themes
      setSuggestedThemes(finalQuestions);
      
      // Update the edited themes
      const newEditedThemes = new Map<number, SliderQuestion>();
      finalQuestions.forEach(theme => {
        newEditedThemes.set(theme.id, theme);
      });
      setEditedThemes(newEditedThemes);
      
      // Set all changes as not saved
      setAllChangesSaved(false);
      
      // Get the latest debug info
      const debugInfo = getLastDebugInfo();
      if (debugInfo) {
        setLocalDebugInfo(debugInfo);
      }
      
      toast({
        title: "Questions generated",
        description: `Generated ${finalQuestions.length} slider questions based on project factors.`,
      });
      
      return { 
        success: true, 
        factorsMissing: false, 
        questions: finalQuestions,
        debugInfo
      };
    } catch (error) {
      console.error("Error generating factor-based questions:", error);
      toast({
        title: "Error",
        description: "Failed to generate questions. Please try again.",
        variant: "destructive",
      });
      return { success: false, factorsMissing: false };
    } finally {
      setLoading(false);
    }
  }, [projectId, activeProject, getInfluencingFactors, setSuggestedThemes, setEditedThemes, setAllChangesSaved]);
  
  return {
    generateFactorBasedQuestions,
    loading: loading || factorsLoading,
    lastDebugInfo
  };
};
