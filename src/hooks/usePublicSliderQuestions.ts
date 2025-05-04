
import { useEffect, useState } from "react";
import { SliderQuestion } from "@/services/types/designTypes";
import { getSliderQuestions } from "@/services/publicForm/sliderQuestionsService";

interface UsePublicSliderQuestionsProps {
  projectId: string | null;
  isTemplateProject?: boolean;
}

export const usePublicSliderQuestions = ({ 
  projectId, 
  isTemplateProject = false 
}: UsePublicSliderQuestionsProps) => {
  const [questions, setQuestions] = useState<SliderQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!projectId) {
        return;
      }

      setLoading(true);
      try {
        console.log(`Fetching public slider questions for project ${projectId}, isTemplate: ${isTemplateProject}`);
        const fetchedQuestions = await getSliderQuestions(projectId, isTemplateProject);
        
        if (fetchedQuestions) {
          setQuestions(fetchedQuestions);
          console.log(`Found ${fetchedQuestions.length} public slider questions`);
        } else {
          setQuestions([]);
          console.log("No public slider questions found");
        }
      } catch (error) {
        console.error("Error fetching public slider questions:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [projectId, isTemplateProject]);

  return { questions, loading };
};
