
import { supabase } from '@/integrations/supabase/client';
import { saveSliderResponses } from './sliderResponseOperations';
import { saveParticipantData } from './participantResponseOperations';
import { saveStory } from './storyOperations';
import { StoryData } from './types';
import { FormSubmissionHandler } from './types';

/**
 * Handles form submission for authenticated users
 * @param formData The form data to submit
 * @returns Promise resolving to true on success, false on failure, or string on special conditions
 */
export const submitAuthenticatedForm: FormSubmissionHandler = async (formData: StoryData): Promise<boolean | string> => {
  if (!formData) {
    console.error("No form data provided");
    return false;
  }

  try {
    console.log("Submitting authenticated form with data:", {
      title: formData.title,
      text: formData.text?.substring(0, 50) + "...",
      emotionalResponse: formData.emotionalResponse,
      sliderResponseCount: formData.sliderResponses?.length || 0,
      participantResponseCount: formData.participantResponses?.length || 0
    });
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    
    if (userError || !userId) {
      console.error("User authentication error:", userError);
      return false;
    }

    // Save the story first
    const storyId = await saveStory(formData, formData.projectId, userId, false);
    
    // Special case: demo limit reached
    if (storyId === "demo-limit-reached") {
      console.log("Demo limit reached for user");
      return "demo-limit-reached";
    }
    
    if (!storyId) {
      console.error("Failed to save story");
      return false;
    }
    
    console.log(`Story saved successfully with ID: ${storyId}. Proceeding to save responses.`);
    
    // Now save slider responses and participant data if we have a valid story ID
    if (typeof storyId === 'string' && storyId !== "error-but-continue") {
      // Save slider responses
      if (formData.sliderResponses && formData.sliderResponses.length > 0) {
        console.log(`Saving ${formData.sliderResponses.length} slider responses for story ${storyId}`);
        await saveSliderResponses(formData, storyId);
      } else {
        console.log("No slider responses to save");
      }
      
      // Save participant data
      if (formData.participantResponses && formData.participantResponses.length > 0) {
        console.log(`Saving ${formData.participantResponses.length} participant responses for story ${storyId}`);
        await saveParticipantData(formData, storyId);
      } else {
        console.log("No participant responses to save");
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error in authenticated form submission:", error);
    return false;
  }
};
