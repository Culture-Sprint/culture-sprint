
import { Project } from "@/types/project";
import { SliderQuestion } from "@/services/types/designTypes";
import { generateWithAI, getLastDebugInfo, AIDebugInfo } from "./sliderQuestionAIGenerator";

/**
 * Hook for generating slider questions using AI based on project factors
 */
export const useAISliderGeneration = () => {
  /**
   * Generate slider questions using AI based on the provided factors and project context
   */
  const generateQuestions = async (
    factors: string[],
    activeProject: Project | null
  ): Promise<SliderQuestion[] | null> => {
    return generateWithAI(factors, activeProject);
  };

  return {
    generateQuestions,
    getLastDebugInfo
  };
};

// Re-export the key items for backward compatibility
export { generateWithAI, getLastDebugInfo };
export type { AIDebugInfo };
