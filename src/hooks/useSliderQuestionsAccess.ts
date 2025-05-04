
import { useEffect, useState } from "react";
import { SliderQuestion } from "@/services/types/designTypes";
import { getSliderQuestionsWithSync } from "@/services/sync/sliderQuestionsSyncService";
import { useTemplateProject } from "@/hooks/projects/useTemplateProject";

interface UseSliderQuestionsAccessProps {
  projectId?: string;
  isTemplateProject?: boolean;
}

export const useSliderQuestionsAccess = ({ 
  projectId, 
  isTemplateProject: incomingIsTemplateProject 
}: UseSliderQuestionsAccessProps) => {
  const [questions, setQuestions] = useState<SliderQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { isTemplateOrClone } = useTemplateProject();
  
  // Determine if this is a template project either from props or from the template detection hook
  const isTemplateProject = incomingIsTemplateProject || 
    (projectId ? isTemplateOrClone({ id: projectId } as any) : false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!projectId) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        console.log(`Fetching slider questions for project ${projectId}, isTemplate: ${isTemplateProject}`);
        // Pass the isTemplateProject flag to the sync service
        const fetchedQuestions = await getSliderQuestionsWithSync(projectId, isTemplateProject);
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching slider questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [projectId, isTemplateProject]);

  return { questions, loading };
};
