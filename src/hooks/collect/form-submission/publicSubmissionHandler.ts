
import { supabase } from '@/integrations/supabase/client';
import { saveSliderResponses } from './sliderResponseOperations';
import { saveParticipantData } from './participantResponseOperations';
import { saveStory } from './storyOperations';
import { StoryData } from './types';

/**
 * Checks if the project has reached demo story limit
 * @param projectId The project ID to check
 * @returns Boolean indicating if limit reached
 */
const checkDemoProjectLimit = async (projectId?: string): Promise<boolean> => {
  if (!projectId) return false;
  
  try {
    // First check if this is a demo project by checking if the owner has the demo role
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('user_id')
      .eq('id', projectId)
      .single();
    
    if (projectError || !projectData?.user_id) {
      console.log("Could not determine project owner for demo check");
      return false;
    }
    
    // Check if the user has the demo role
    const { data: roles, error: roleError } = await supabase.rpc('get_user_roles', {
      user_id: projectData.user_id
    });
    
    if (roleError) {
      console.error("Error checking user roles for demo limit:", roleError);
      return false;
    }
    
    // If not a demo account, no limit applies
    const isDemo = Array.isArray(roles) && roles.some(role => role.role_name === 'demo');
    if (!isDemo) return false;
    
    // Count stories in the project
    const { count, error: countError } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .eq('st_project_id', projectId);
    
    if (countError) {
      console.error("Error counting stories for demo limit:", countError);
      return false;
    }
    
    // Check if the count is at or above the limit
    return (count || 0) >= 15;
  } catch (error) {
    console.error("Error in demo project limit check:", error);
    return false;
  }
};

/**
 * Handles form submission for public (unauthenticated) users
 * @param formData The form data to submit
 * @returns Promise resolving to true on success, false on failure
 */
export const submitPublicForm = async (formData: StoryData): Promise<boolean | string> => {
  if (!formData) {
    console.error("No form data provided for public submission");
    return false;
  }

  try {
    console.log("Submitting public form with data:", {
      title: formData.title,
      text: formData.text?.substring(0, 50) + "...",
      emotionalResponse: formData.emotionalResponse,
      projectId: formData.projectId,
      sliderResponseCount: formData.sliderResponses?.length || 0,
      participantResponseCount: formData.participantResponses?.length || 0
    });
    
    // Check if project is from a demo account and has reached the limit
    if (formData.projectId) {
      const limitReached = await checkDemoProjectLimit(formData.projectId);
      
      if (limitReached) {
        console.log(`Public form submission rejected - demo project ${formData.projectId} has reached story limit`);
        return 'demo-limit-reached';
      }
    }
    
    // Save the story with isPublic=true flag
    const storyId = await saveStory(formData, formData.projectId, undefined, true);
    
    if (!storyId) {
      console.error("Failed to save public story");
      return false;
    }
    
    console.log(`Public story saved successfully with ID: ${storyId}. Proceeding to save responses.`);
    
    // Save slider responses and participant data if we have a valid story ID
    if (typeof storyId === 'string' && storyId !== "error-but-continue") {
      // Save slider responses
      if (formData.sliderResponses && formData.sliderResponses.length > 0) {
        console.log(`Saving ${formData.sliderResponses.length} slider responses for public story ${storyId}`);
        await saveSliderResponses(formData, storyId);
      } else {
        console.log("No slider responses to save for public story");
      }
      
      // Save participant data
      if (formData.participantResponses && formData.participantResponses.length > 0) {
        console.log(`Saving ${formData.participantResponses.length} participant responses for public story ${storyId}`);
        await saveParticipantData(formData, storyId);
      } else {
        console.log("No participant responses to save for public story");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in public form submission:", error);
    return false;
  }
};
