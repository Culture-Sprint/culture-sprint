
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches participant responses for a specific project and optional array of story IDs
 * @param projectId The project ID to fetch participant responses for
 * @param storyIds Optional array of story IDs to filter by
 * @returns Array of participant response objects
 */
export const fetchParticipantResponsesForProject = async (projectId: string, storyIds?: string[]) => {
  try {
    console.log(`STORY SERVICE - Fetching participant responses for project ID: ${projectId}`);
    
    let query = supabase
      .from('participant_responses')
      .select('id, story_id, question_id, question_text, response, created_at, pr_project_id') // Updated column name
      .eq('pr_project_id', projectId); // Updated column name
    
    // If story IDs are provided, filter by them as well
    if (storyIds && storyIds.length > 0) {
      query = query.in('story_id', storyIds);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`STORY SERVICE - Error fetching participant responses for project ${projectId}:`, error);
      return [];
    }
    
    console.log(`STORY SERVICE - Fetched ${data?.length || 0} participant responses for project ${projectId}`);
    return data || [];
  } catch (error) {
    console.error(`STORY SERVICE - Exception in fetchParticipantResponsesForProject for ${projectId}:`, error);
    return [];
  }
};

/**
 * Legacy method: Fetches participant responses for multiple stories
 * @param storyIds Array of story IDs to fetch participant responses for
 * @returns Array of participant response objects
 */
export const fetchParticipantResponses = async (storyIds: string[]) => {
  if (storyIds.length === 0) return [];
  
  const allResponses = [];
  for (const storyId of storyIds) {
    const responses = await fetchParticipantResponsesForStory(storyId);
    allResponses.push(...responses);
  }
  
  return allResponses;
};

/**
 * Legacy method: Fetches participant responses for a single story
 * @param storyId The story ID to fetch participant responses for
 * @returns Array of participant response objects
 */
export const fetchParticipantResponsesForStory = async (storyId: string) => {
  try {
    console.log(`STORY SERVICE - Fetching participant responses for story ID: ${storyId}`);
    
    const { data, error } = await supabase
      .from('participant_responses')
      .select('id, story_id, question_id, question_text, response, created_at')
      .eq('story_id', storyId);
    
    if (error) {
      console.error(`STORY SERVICE - Error fetching participant responses for ${storyId}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`STORY SERVICE - Exception in fetchParticipantResponsesForStory for ${storyId}:`, error);
    return [];
  }
};
