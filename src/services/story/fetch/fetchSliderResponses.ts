
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches slider responses for a specific project and optional array of story IDs
 * @param projectId The project ID to fetch slider responses for
 * @param storyIds Optional array of story IDs to filter by
 * @returns Array of slider response objects
 */
export const fetchSliderResponsesForProject = async (projectId: string, storyIds?: string[]) => {
  try {
    console.log(`STORY SERVICE - Fetching slider responses for project ID: ${projectId}`);
    
    let query = supabase
      .from('slider_responses')
      .select('id, story_id, question_id, question_text, value, response_type, left_label, right_label, created_at, sr_project_id') // Updated column name
      .eq('sr_project_id', projectId); // Updated column name
    
    // If story IDs are provided, filter by them as well
    if (storyIds && storyIds.length > 0) {
      query = query.in('story_id', storyIds);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`STORY SERVICE - Error fetching slider responses for project ${projectId}:`, error);
      return [];
    }
    
    console.log(`STORY SERVICE - Fetched ${data?.length || 0} slider responses for project ${projectId}`);
    return data || [];
  } catch (error) {
    console.error(`STORY SERVICE - Exception in fetchSliderResponsesForProject for ${projectId}:`, error);
    return [];
  }
};

/**
 * Legacy method: Fetches slider responses for multiple stories
 * @param storyIds Array of story IDs to fetch slider responses for
 * @returns Array of slider response objects
 */
export const fetchSliderResponses = async (storyIds: string[]) => {
  if (storyIds.length === 0) return [];
  
  const allResponses = [];
  for (const storyId of storyIds) {
    const responses = await fetchSliderResponsesForStory(storyId);
    allResponses.push(...responses);
  }
  
  return allResponses;
};

/**
 * Legacy method: Fetches slider responses for a single story
 * @param storyId The story ID to fetch slider responses for
 * @returns Array of slider response objects
 */
export const fetchSliderResponsesForStory = async (storyId: string) => {
  try {
    console.log(`STORY SERVICE - Fetching slider responses for story ID: ${storyId}`);
    
    const { data, error } = await supabase
      .from('slider_responses')
      .select('id, story_id, question_id, question_text, value, response_type, left_label, right_label, created_at')
      .eq('story_id', storyId);
    
    if (error) {
      console.error(`STORY SERVICE - Error fetching slider responses for ${storyId}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`STORY SERVICE - Exception in fetchSliderResponsesForStory for ${storyId}:`, error);
    return [];
  }
};
