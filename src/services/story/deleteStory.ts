
import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/utils/errorHandling";

/**
 * Deletes a story and its associated responses from the database
 * @param storyId The ID of the story to delete
 * @returns A boolean indicating if the deletion was successful
 */
export const deleteStory = async (storyId: string | number): Promise<boolean> => {
  console.log("STORY SERVICE - Deleting story:", storyId);
  
  // Always convert the ID to string to ensure type compatibility with Supabase
  const storyIdStr = String(storyId);
  
  try {
    // First check if the story exists
    const { data: storyExists, error: checkError } = await supabase
      .from('stories')
      .select('id')
      .eq('id', storyIdStr)
      .maybeSingle();
      
    if (checkError) {
      console.error("STORY SERVICE - Error checking if story exists:", checkError);
      return false;
    }
    
    if (!storyExists) {
      console.error("STORY SERVICE - Story not found:", storyIdStr);
      return false;
    }
    
    console.log("STORY SERVICE - Found story to delete:", storyIdStr);
    
    // Delete associated slider responses first using the new RPC function
    const { data: sliderResult, error: sliderError } = await supabase
      .rpc('delete_story_responses', {
        story_id_param: storyIdStr,
        table_name: 'slider_responses'
      });
    
    if (sliderError) {
      console.error("STORY SERVICE - Error deleting slider responses:", sliderError);
      // Fall back to direct deletion without RPC
      const { error: directSliderError } = await supabase
        .from('slider_responses')
        .delete()
        .filter('story_id', 'eq', storyIdStr);
        
      if (directSliderError) {
        console.error("STORY SERVICE - Direct deletion of slider responses failed:", directSliderError);
        return false;
      }
    }
    
    // Delete associated participant responses next using the new RPC function
    const { data: participantResult, error: participantError } = await supabase
      .rpc('delete_story_responses', {
        story_id_param: storyIdStr,
        table_name: 'participant_responses'
      });
    
    if (participantError) {
      console.error("STORY SERVICE - Error deleting participant responses:", participantError);
      // Fall back to direct deletion without RPC
      const { error: directParticipantError } = await supabase
        .from('participant_responses')
        .delete()
        .filter('story_id', 'eq', storyIdStr);
        
      if (directParticipantError) {
        console.error("STORY SERVICE - Direct deletion of participant responses failed:", directParticipantError);
        return false;
      }
    }
    
    // Finally delete the story itself using the new RPC function
    const { data: storyResult, error: storyError } = await supabase
      .rpc('delete_story', {
        story_id_param: storyIdStr
      });
    
    if (storyError) {
      console.error("STORY SERVICE - Error deleting story via RPC:", storyError);
      // Fall back to direct deletion without RPC
      const { error: directStoryError } = await supabase
        .from('stories')
        .delete()
        .filter('id', 'eq', storyIdStr);
        
      if (directStoryError) {
        console.error("STORY SERVICE - Direct deletion of story failed:", directStoryError);
        return false;
      }
    }
    
    // Verify deletion was successful
    const { data: verifyDeletion, error: verifyError } = await supabase
      .from('stories')
      .select('id')
      .eq('id', storyIdStr)
      .maybeSingle();
      
    if (verifyError) {
      console.error("STORY SERVICE - Error verifying deletion:", verifyError);
    }
    
    if (verifyDeletion) {
      console.error("STORY SERVICE - Story still exists after deletion attempt:", storyIdStr);
      return false;
    }
    
    console.log("STORY SERVICE - Successfully deleted story and all related data:", storyIdStr);
    return true;
  } catch (error) {
    console.error("STORY SERVICE - Error in deleteStory:", error);
    return false;
  }
};
