
import { useEffect, useState } from "react";
import { Story } from "@/types/story";
import { SliderQuestion } from "../histogramUtils";
import { useSliderQuestionsAccess } from "@/hooks/useSliderQuestionsAccess";

/**
 * Custom hook to process slider questions from stories
 */
export function useSliderQuestionsProcess(stories: Story[]) {
  const [questionList, setQuestionList] = useState<SliderQuestion[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  
  // Get project ID from localStorage for fetching enriched question data
  const projectId = localStorage.getItem('activeProject') 
    ? JSON.parse(localStorage.getItem('activeProject') || '{}').id 
    : undefined;
  
  // Use the access hook to get the full question details
  const { questions: enrichedQuestions, loading } = useSliderQuestionsAccess({ 
    projectId, 
    isTemplateProject: false 
  });
  
  // Debug log the enriched questions
  useEffect(() => {
    if (enrichedQuestions.length > 0) {
      console.log("useSliderQuestionsProcess - Enriched questions loaded:", 
        enrichedQuestions.map(q => ({ id: q.id, question: q.question?.substring(0, 30) }))
      );
    }
  }, [enrichedQuestions]);
  
  // Extract and organize slider data from stories
  useEffect(() => {
    const sliderQuestions: Record<number, SliderQuestion> = {};
    
    // First pass: collect all slider questions
    stories.forEach(story => {
      if (story.sliderResponses && Array.isArray(story.sliderResponses)) {
        story.sliderResponses.forEach(response => {
          if (!sliderQuestions[response.question_id]) {
            // Try to find the enriched question data first
            const enrichedQuestion = enrichedQuestions.find(q => q.id === response.question_id);
            
            sliderQuestions[response.question_id] = {
              id: response.question_id,
              question_text: enrichedQuestion?.question || response.question_text || `Question ${response.question_id}`,
              left_label: enrichedQuestion?.leftLabel || response.left_label || "Low",
              right_label: enrichedQuestion?.rightLabel || response.right_label || "High",
              responses: [],
              average: 0,
              stories: []
            };
          }
        });
      }
    });
    
    // Second pass: collect responses for each question
    stories.forEach(story => {
      if (story.sliderResponses && Array.isArray(story.sliderResponses)) {
        story.sliderResponses.forEach(response => {
          if (typeof response.value === 'number') {
            sliderQuestions[response.question_id].responses.push(response.value);
            // Add story data for emotion coloring
            if (sliderQuestions[response.question_id].stories) {
              sliderQuestions[response.question_id].stories?.push({
                id: String(story.id),
                feeling: story.feeling || 'neutral',
                value: response.value
              });
            }
          }
        });
      }
    });
    
    // Calculate averages and prepare question list
    let processedQuestions = Object.values(sliderQuestions).map(question => {
      // Calculate average for non-empty responses
      const validResponses = question.responses.filter(r => typeof r === 'number');
      question.average = validResponses.length > 0 
        ? Math.round((validResponses.reduce((sum, val) => sum + val, 0) / validResponses.length) * 10) / 10
        : 0;
      
      return question;
    }).filter(q => q.responses.length > 0);
    
    // Sort questions by number of responses (descending)
    processedQuestions.sort((a, b) => b.responses.length - a.responses.length);
    
    // Debug logging
    console.log("useSliderQuestionsProcess - Processed questions:", 
      processedQuestions.map(q => ({ 
        id: q.id, 
        text: q.question_text.substring(0, 30) + "...",
        responsesCount: q.responses.length 
      }))
    );
    
    setQuestionList(processedQuestions);
  }, [stories, enrichedQuestions]);
  
  // If no question is selected yet but we have questions, select the first one
  useEffect(() => {
    if (selectedQuestionId === null && questionList.length > 0) {
      setSelectedQuestionId(questionList[0].id);
    }
  }, [questionList, selectedQuestionId]);
  
  return {
    questionList,
    selectedQuestionId,
    setSelectedQuestionId,
    // Find the selected question or default to the first question
    selectedQuestion: selectedQuestionId !== null 
      ? questionList.find(q => q.id === selectedQuestionId) 
      : questionList[0],
    loading
  };
}
