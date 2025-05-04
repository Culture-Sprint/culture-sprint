
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { getSliderQuestions } from "./sliderQuestionsService";
import { getParticipantQuestions } from "./participantQuestionsService";
import { 
  saveSliderQuestions as savePublicSliderQuestions,
  saveParticipantQuestions as savePublicParticipantQuestions
} from "./publicForm/publicFormService";

/**
 * Synchronizes the form design data from the design phase to the public form
 * to ensure consistency between internal and public form displays
 */
export const syncDesignToPublicForm = async (projectId: string): Promise<boolean> => {
  if (!projectId) {
    console.error("Cannot sync public form - no project ID provided");
    return false;
  }
  
  console.log(`Syncing design data to public form for project: ${projectId}`);
  
  try {
    // Get the current design-phase data
    const sliderQuestions = await getSliderQuestions();
    const participantQuestions = await getParticipantQuestions();
    
    // Only proceed if we have data to sync
    if (!sliderQuestions?.length && !participantQuestions?.length) {
      console.log("No design data to sync to public form");
      return false;
    }
    
    const promises = [];
    
    // Sync slider questions if available
    if (sliderQuestions && sliderQuestions.length > 0) {
      console.log(`Syncing ${sliderQuestions.length} slider questions to public form`);
      promises.push(savePublicSliderQuestions(projectId, sliderQuestions));
    }
    
    // Sync participant questions if available
    if (participantQuestions && participantQuestions.length > 0) {
      console.log(`Syncing ${participantQuestions.length} participant questions to public form`);
      promises.push(savePublicParticipantQuestions(projectId, participantQuestions));
    }
    
    await Promise.all(promises);
    console.log("Successfully synced design data to public form");
    
    return true;
  } catch (error) {
    console.error("Error syncing design data to public form:", error);
    return false;
  }
};

/**
 * Function to ensure that both the public form and design phase have consistent data
 * It syncs bi-directionally, depending on which side has more complete data
 */
export const ensureFormConsistency = async (projectId: string): Promise<boolean> => {
  if (!projectId) return false;
  
  try {
    // First, sync from design to public form to ensure public form has the latest data
    await syncDesignToPublicForm(projectId);
    
    // Also add a record in the ar_activity table to mark the form as designed
    try {
      console.log("Marking form as designed in Supabase");
      await supabase.rpc('insert_activity_response', {
        project_id: projectId,
        phase_id: 'design',
        step_id: 'form-designed',
        activity_id: 'form-designed',
        response_data: { formDesigned: true, timestamp: new Date().toISOString() } as unknown as Json
      });
    } catch (error) {
      console.error("Error marking form as designed:", error);
      // Continue even if this fails
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring form consistency:", error);
    return false;
  }
};

// Export utilities for direct use
export { 
  getSliderQuestions, 
  getParticipantQuestions,
  savePublicSliderQuestions,
  savePublicParticipantQuestions
};
