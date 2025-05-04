
import { useState, useEffect, useMemo } from "react";
import { Story, SliderResponse, ParticipantResponse } from "@/types/story";
import { getProjectSliderQuestions } from "@/services/accessQuestions";

export interface SliderQuestion {
  id: number;
  text: string;
  theme?: string;
  question?: string;
  leftLabel?: string;
  rightLabel?: string;
  sliderValue?: number;
  left_label?: string;
  right_label?: string;
}

export interface ParticipantFilter {
  id: string;
  text: string;
  choices: string[];
}

export const useSliderQuestions = (stories: Story[]) => {
  // Extract all unique slider questions from the stories initially
  const initialSliderQuestions = useMemo(() => {
    const questions = new Map<number, SliderQuestion>();
    
    stories.forEach(story => {
      if (story.sliderResponses) {
        story.sliderResponses.forEach(response => {
          if (!questions.has(response.question_id)) {
            questions.set(response.question_id, {
              id: response.question_id,
              text: response.question_text,
              left_label: response.left_label || "Low",
              right_label: response.right_label || "High"
            });
          }
        });
      }
    });
    
    return Array.from(questions.values());
  }, [stories]);
  
  // State to store the enriched questions
  const [sliderQuestions, setSliderQuestions] = useState<SliderQuestion[]>(initialSliderQuestions);
  
  // Fetch the full question details from the database
  useEffect(() => {
    const fetchFullQuestions = async () => {
      // Get project ID from localStorage
      const activeProject = localStorage.getItem('activeProject');
      if (!activeProject) return;
      
      try {
        const projectData = JSON.parse(activeProject);
        const projectId = projectData.id;
        
        // Fetch all slider questions for this project
        const fullQuestions = await getProjectSliderQuestions(projectId);
        
        // Map the full questions to our existing questions
        if (fullQuestions.length > 0) {
          const enrichedQuestions = initialSliderQuestions.map(q => {
            const fullQuestion = fullQuestions.find(fq => fq.id === q.id);
            if (fullQuestion) {
              return {
                ...q,
                text: fullQuestion.question || q.text,
                left_label: fullQuestion.leftLabel || q.left_label,
                right_label: fullQuestion.rightLabel || q.right_label
              };
            }
            return q;
          });
          
          setSliderQuestions(enrichedQuestions);
        }
      } catch (error) {
        console.error("Error fetching full slider questions:", error);
      }
    };
    
    fetchFullQuestions();
  }, [initialSliderQuestions]);
  
  return sliderQuestions;
};

export const useParticipantFilters = (stories: Story[]) => {
  // Extract all unique participant questions from the stories
  const participantFilters = useMemo(() => {
    const questions = new Map<string, ParticipantFilter>();
    
    stories.forEach(story => {
      if (story.participantResponses) {
        story.participantResponses.forEach(response => {
          if (!questions.has(response.question_id)) {
            questions.set(response.question_id, {
              id: response.question_id,
              text: response.question_text,
              choices: []
            });
          }
          
          const question = questions.get(response.question_id);
          if (question && !question.choices.includes(response.response)) {
            question.choices.push(response.response);
          }
        });
      }
    });
    
    return Array.from(questions.values());
  }, [stories]);
  
  return participantFilters;
};

export const useChartData = (
  stories: Story[],
  xAxisQuestion: number | null,
  yAxisQuestion: number | null,
  sliderQuestions: SliderQuestion[],
  filters: Record<string, Set<string>> = {}
) => {
  // Default empty labels
  const defaultLabels = { left: "", right: "", text: "Select a question" };
  
  // Get the axis labels from the selected questions
  const xAxisLabels = useMemo(() => {
    if (!xAxisQuestion) return defaultLabels;
    const question = sliderQuestions.find(q => q.id === xAxisQuestion);
    return question 
      ? { left: question.left_label, right: question.right_label, text: question.text }
      : defaultLabels;
  }, [xAxisQuestion, sliderQuestions]);
  
  const yAxisLabels = useMemo(() => {
    if (!yAxisQuestion) return defaultLabels;
    const question = sliderQuestions.find(q => q.id === yAxisQuestion);
    return question 
      ? { left: question.left_label, right: question.right_label, text: question.text }
      : defaultLabels;
  }, [yAxisQuestion, sliderQuestions]);
  
  // Generate chart data based on the selected questions
  const chartData = useMemo(() => {
    if (!xAxisQuestion || !yAxisQuestion) return [];
    
    return stories
      .filter(story => {
        // Filter based on participant responses if filters are set
        if (Object.keys(filters).length > 0) {
          if (!story.participantResponses) return false;
          
          for (const questionId of Object.keys(filters)) {
            const selectedChoices = filters[questionId];
            if (selectedChoices.size === 0) continue;
            
            const responseForQuestion = story.participantResponses.find(
              r => r.question_id === questionId
            );
            
            if (!responseForQuestion || !selectedChoices.has(responseForQuestion.response)) {
              return false;
            }
          }
        }
        
        // Check if the story has responses for both selected questions
        const hasXResponse = story.sliderResponses?.some(
          r => r.question_id === xAxisQuestion && r.value !== null
        );
        const hasYResponse = story.sliderResponses?.some(
          r => r.question_id === yAxisQuestion && r.value !== null
        );
        
        return hasXResponse && hasYResponse;
      })
      .map(story => {
        // Get the x and y values from the slider responses
        const xResponse = story.sliderResponses?.find(
          r => r.question_id === xAxisQuestion
        );
        const yResponse = story.sliderResponses?.find(
          r => r.question_id === yAxisQuestion
        );
        
        const x = xResponse?.value !== null ? xResponse?.value : 0;
        const y = yResponse?.value !== null ? yResponse?.value : 0;
        
        return {
          x,
          y,
          storyId: story.id,
          storyTitle: story.title,
          feeling: story.feeling,
          feelingSentiment: story.feelingSentiment,
          xAxisLabel: xAxisLabels.text,
          yAxisLabel: yAxisLabels.text,
          participantResponses: story.participantResponses,
          storyData: story // Include the complete story object
        };
      });
  }, [stories, xAxisQuestion, yAxisQuestion, xAxisLabels, yAxisLabels, filters]);
  
  return { xAxisLabels, yAxisLabels, chartData };
};

// Remove the duplicate export statement that was causing the error
