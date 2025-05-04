
import { useEffect, useRef } from "react";
import { Story } from "@/types/story";
import { ParticipantFilter } from "../../slider-comparison/useSliderQuestions";

/**
 * Custom hook to extract participant filters from stories
 */
export function useParticipantFiltersExtract(stories: Story[]) {
  // Extract participant questions from stories
  const participantFilters = useRef<ParticipantFilter[]>([]);
  
  useEffect(() => {
    const extractParticipantFilters = () => {
      const filtersMap = new Map<string, ParticipantFilter>();
      
      stories.forEach(story => {
        if (story.participantResponses) {
          story.participantResponses.forEach(response => {
            if (!filtersMap.has(response.question_id)) {
              filtersMap.set(response.question_id, {
                id: response.question_id,
                text: response.question_text,
                choices: []
              });
            }
            
            const filter = filtersMap.get(response.question_id);
            if (filter && !filter.choices.includes(response.response)) {
              filter.choices.push(response.response);
            }
          });
        }
      });
      
      // Sort choices alphabetically for each filter
      filtersMap.forEach(filter => {
        filter.choices.sort();
      });
      
      participantFilters.current = Array.from(filtersMap.values());
    };
    
    extractParticipantFilters();
  }, [stories]);
  
  return participantFilters.current;
}
