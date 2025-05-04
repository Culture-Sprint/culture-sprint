
import { useCallback, useRef } from "react";
import { getParticipantQuestionsWithSync } from "@/services/sync/participantQuestionsSyncService";
import { clearActivityCache } from "@/services/supabaseSync/core/cacheUtils";
import { toast } from "@/components/ui/use-toast";
import { useProject } from "@/contexts/ProjectContext";
import { Option } from "./useParticipantQuestionState";

export interface FetchProps {
  setDefinedQuestions: (questions: any[]) => void;
  setOptions: (setter: (prev: Option[]) => Option[]) => void;
  setOtherOptions: (setter: (prev: Option[]) => Option[]) => void;
  options: Option[];
}

export const useParticipantQuestionFetch = ({
  setDefinedQuestions,
  setOptions,
  setOtherOptions,
  options
}: FetchProps) => {
  const { activeProject } = useProject();
  const projectId = activeProject?.id || '';
  const isFetchingRef = useRef(false);

  // Fetch participant questions from the server
  const fetchParticipantQuestions = useCallback(async () => {
    if (!projectId || isFetchingRef.current) return;
    
    console.log("useParticipantQuestionFetch: Fetching questions for project", projectId);
    isFetchingRef.current = true;
    
    try {
      const questions = await getParticipantQuestionsWithSync(projectId);
      
      if (Array.isArray(questions) && questions.length > 0) {
        console.log("useParticipantQuestionFetch: Fetched questions", questions);
        
        // Update defined questions
        setDefinedQuestions(questions);
        
        // Update options based on fetched questions
        const questionIds = questions.map(q => q.id);
        
        setOptions(prevOptions => 
          prevOptions.map(option => ({
            ...option,
            checked: questionIds.includes(option.id)
          }))
        );
        
        // Update other options - rebuild the entire other options array
        const defaultOptionIds = options.map(o => o.id);
        
        // Find all questions that aren't in default options
        const newOtherOptions = questions
          .filter(q => !defaultOptionIds.includes(q.id))
          .map(q => ({
            id: q.id,
            label: q.label,
            checked: true
          }));
        
        setOtherOptions(() => newOtherOptions);
        
        // Mark the activity as completed in localStorage
        localStorage.setItem('participantQuestionsSaved', 'true');
        if (projectId) {
          localStorage.setItem(`participantQuestionsSaved_${projectId}`, 'true');
        }
      }
    } catch (error) {
      console.error("Error fetching participant questions:", error);
      toast({
        title: "Error",
        description: "Failed to load participant questions. Please try again.",
        variant: "destructive"
      });
    } finally {
      isFetchingRef.current = false;
    }
  }, [projectId, options, setDefinedQuestions, setOptions, setOtherOptions]);
  
  // Function to manually refresh questions
  const refreshParticipantQuestions = useCallback(async () => {
    if (!projectId) return;
    
    // Clear cache to ensure fresh data
    clearActivityCache(projectId, 'collection', 'questions', 'participant-questions');
    
    return fetchParticipantQuestions();
  }, [projectId, fetchParticipantQuestions]);

  return {
    fetchParticipantQuestions,
    refreshParticipantQuestions,
    isFetchingRef
  };
};
