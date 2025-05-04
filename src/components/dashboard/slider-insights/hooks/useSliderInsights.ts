
import { useState } from "react";
import { Story } from "@/types/story";
import { useProcessStoryEmotions } from "./useProcessStoryEmotions";
import { useParticipantFiltersExtract } from "./useParticipantFiltersExtract";
import { useSliderQuestionsProcess } from "./useSliderQuestionsProcess";

/**
 * Main hook that combines all slider insights functionality
 */
export function useSliderInsights(stories: Story[], colorByEmotions: boolean) {
  // Process emotions for stories
  const { 
    processedStories, 
    isProcessing, 
    processingComplete 
  } = useProcessStoryEmotions(stories, colorByEmotions);
  
  // Extract participant filters
  const participantFilters = useParticipantFiltersExtract(stories);
  
  // Process slider questions
  const {
    questionList,
    selectedQuestionId,
    setSelectedQuestionId,
    selectedQuestion,
    loading
  } = useSliderQuestionsProcess(stories);
  
  return {
    questionList,
    selectedQuestion,
    selectedQuestionId,
    setSelectedQuestionId,
    processedStories,
    isProcessing,
    processingComplete,
    participantFilters,
    loading
  };
}
