
import { supabase } from "@/integrations/supabase/client";
import { StoryData, ParticipantResponseData } from './types';

/**
 * Save participant data to the database
 * @param formData The form submission data containing participant responses
 * @param storyId The ID of the story these responses belong to
 * @returns Promise resolving when the operation completes
 */
export const saveParticipantData = async (
  formData: StoryData,
  storyId: string
): Promise<void> => {
  // Skip if no participant responses
  if (!formData.participantResponses || formData.participantResponses.length === 0) {
    console.log("No participant responses to save");
    return;
  }
  
  console.log("Saving participant responses:", formData.participantResponses);
  const participantInserts = prepareParticipantResponsesData(formData, storyId);
  
  if (participantInserts.length > 0) {
    console.log(`Attempting to save ${participantInserts.length} participant responses:`, participantInserts);
    
    // Insert each participant response individually to avoid transaction issues
    const insertPromises = participantInserts.map(item => {
      const preparedItem = {
        ...item,
        story_id: storyId // Explicitly ensure story_id is set
      };
      
      console.log("Inserting participant response:", preparedItem);
      
      return supabase
        .from('participant_responses')
        .insert(preparedItem);
    });
    
    try {
      const results = await Promise.all(insertPromises);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        console.error("Errors saving some participant responses:", errors);
        console.log("Error details:", errors.map(e => ({ message: e.message, details: e.details })));
      } else {
        console.log(`Successfully saved ${participantInserts.length} participant responses`);
      }
    } catch (error) {
      console.error("Error saving participant responses in batch:", error);
    }
  }
};

/**
 * Prepare participant response data from form submission for database insertion
 * @param formData The form submission data containing participant responses
 * @param storyId The ID of the story these responses belong to
 * @returns Array of prepared participant response data objects
 */
export const prepareParticipantResponsesData = (formData: StoryData, storyId: string): ParticipantResponseData[] => {
  const participantInserts: ParticipantResponseData[] = [];
  
  if (formData.participantResponses && formData.participantResponses.length > 0) {
    console.log(`Processing ${formData.participantResponses.length} participant responses`);
    
    formData.participantResponses.forEach(response => {
      // Only add responses that have actual content
      if (response.choiceText && response.choiceText.trim() !== '') {
        participantInserts.push({
          story_id: storyId,
          question_id: response.questionId,
          question_text: response.questionText,
          response: response.choiceText,
          pr_project_id: formData.projectId
        });
        
        console.log(`Prepared participant response: Question: ${response.questionText}, Answer: ${response.choiceText}`);
      } else {
        console.log(`Skipping empty participant response for question: ${response.questionText}`);
      }
    });
  }
  
  return participantInserts;
};
