
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { useSliderQuestionsAccess } from "@/hooks/useSliderQuestionsAccess";
import { SliderQuestion } from "@/services/accessQuestions";

interface SliderResponse {
  id: string;
  question_id: number;
  question_text: string;
  value: number | null;
  response_type?: "answered" | "skipped";
  left_label?: string;
  right_label?: string;
}

interface SliderResponsesSectionProps {
  sliderResponses: SliderResponse[];
}

const SliderResponsesSection = ({ sliderResponses }: SliderResponsesSectionProps) => {
  const [projectId, setProjectId] = useState<string | undefined>(undefined);
  
  // Fix the type issue by passing an object with the correct properties
  const { questions, loading } = useSliderQuestionsAccess({ 
    projectId, 
    isTemplateProject: true 
  });
  
  const [enrichedResponses, setEnrichedResponses] = useState<SliderResponse[]>([]);
  
  // Extract project ID from the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdFromUrl = urlParams.get('projectId');
    
    if (projectIdFromUrl) {
      setProjectId(projectIdFromUrl);
    } else {
      // Fallback to getting the projectId from local storage
      const activeProject = localStorage.getItem('activeProject');
      if (activeProject) {
        try {
          const projectData = JSON.parse(activeProject);
          setProjectId(projectData.id);
        } catch (e) {
          console.error("Failed to parse active project from localStorage:", e);
        }
      }
    }
  }, []);
  
  // Enrich slider responses with full question data
  useEffect(() => {
    if (!loading && questions.length > 0 && sliderResponses.length > 0) {
      const updatedResponses = sliderResponses.map(response => {
        // Try to find the matching question by ID
        const matchingQuestion = questions.find(q => q.id === response.question_id);
        
        if (matchingQuestion) {
          return {
            ...response,
            // Use the full question text instead of generic text
            question_text: matchingQuestion.question || response.question_text,
            // Use the labels from the question definition if response doesn't have them
            left_label: response.left_label || matchingQuestion.leftLabel,
            right_label: response.right_label || matchingQuestion.rightLabel
          };
        }
        return response;
      });
      
      setEnrichedResponses(updatedResponses);
    } else {
      setEnrichedResponses(sliderResponses);
    }
  }, [questions, sliderResponses, loading]);
  
  // Debug logging
  console.log("StoryDialogSliderResponses - Project ID:", projectId);
  console.log("StoryDialogSliderResponses - Questions loaded:", questions.length);
  console.log("StoryDialogSliderResponses - Enriched responses:", enrichedResponses);
  
  if (sliderResponses.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Scale Responses</h3>
      <div className="space-y-4">
        {enrichedResponses.map((slider) => (
          <div key={slider.id} className="border rounded-md p-4">
            <p className="font-medium mb-2">{slider.question_text || `Question ${slider.question_id}`}</p>
            {slider.response_type === "skipped" || slider.value === null ? (
              <div className="text-gray-500 italic">No response provided</div>
            ) : (
              <>
                <div className="mb-2">
                  <Progress value={slider.value} className="h-2" />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{slider.left_label || "Low"}</span>
                  <span className="font-medium">Value: {slider.value}</span>
                  <span>{slider.right_label || "High"}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderResponsesSection;
