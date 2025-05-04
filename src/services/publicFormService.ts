
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_ACTIVITY_IDS } from "./publicForm/constants";
import { Json } from "@/integrations/supabase/types";
import { PublicFormData, isPlainObject } from "./publicForm/types";

/**
 * Gets the complete form configuration for a public form
 * @param projectId Project ID
 * @returns Public form data
 */
export const getPublicForm = async (projectId: string): Promise<PublicFormData | null> => {
  try {
    console.log(`Fetching public form data for project: ${projectId}`);
    
    // First try to load from public form configuration (which might be null)
    // If no data found in specialized public form tables, fall back to the main project data
    
    // Import needed functions dynamically to avoid circular dependencies
    const { getStoryQuestion } = await import('./publicForm/storyQuestionService');
    const { getSliderQuestions } = await import('./publicForm/sliderQuestionsService');
    const { getParticipantQuestions } = await import('./publicForm/participantQuestionsService');
    
    // Get all the form components in parallel
    const [storyQuestion, sliderQuestions, participantQuestions] = await Promise.all([
      getStoryQuestion(projectId),
      getSliderQuestions(projectId),
      getParticipantQuestions(projectId)
    ]);
    
    // If no public form data found, try to get it from the main project data and sync it to public form
    if ((!storyQuestion || !storyQuestion.trim()) && 
        (!sliderQuestions || sliderQuestions.length === 0) && 
        (!participantQuestions || participantQuestions.length === 0)) {
      
      console.log("No public form data found, trying to sync from main project data...");
      
      // Load from main project activity responses
      const { data, error } = await supabase
        .from('activity_responses')
        .select('ar_activity_id, ar_response')
        .eq('ar_project_id', projectId)
        .eq('ar_phase_id', 'collection')
        .in('ar_activity_id', ['story-questions', 'slider-questions', 'participant-questions'])
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching main project form data:", error);
      } else if (data && data.length > 0) {
        console.log(`Found ${data.length} activity responses to sync to public form`);
        
        // Process the data and save it to public form
        const { saveStoryQuestion } = await import('./publicForm/storyQuestionService');
        const { saveSliderQuestions } = await import('./publicForm/sliderQuestionsService');
        const { saveParticipantQuestions } = await import('./publicForm/participantQuestionsService');
        
        // Parse and save each type of data
        let syncedStoryQuestion = storyQuestion;
        let syncedSliderQuestions = sliderQuestions || [];
        let syncedParticipantQuestions = participantQuestions || [];
        
        for (const item of data) {
          if (item.ar_activity_id === 'story-questions' && item.ar_response) {
            // Extract story question - check if the response is an object first
            if (isPlainObject(item.ar_response)) {
              const responseObj = item.ar_response as Record<string, any>;
              const mainStoryQuestion = responseObj.question || "";
              
              if (mainStoryQuestion && typeof mainStoryQuestion === 'string') {
                console.log("Found main story question, syncing to public form:", mainStoryQuestion);
                await saveStoryQuestion(projectId, mainStoryQuestion);
                syncedStoryQuestion = mainStoryQuestion; // Update the value for the return
              }
            }
          } else if (item.ar_activity_id === 'slider-questions' && item.ar_response) {
            // Extract slider questions - handle different possible formats
            let mainSliderQuestions: any[] = [];
            
            if (Array.isArray(item.ar_response)) {
              mainSliderQuestions = item.ar_response;
            } else if (isPlainObject(item.ar_response)) {
              const responseObj = item.ar_response as Record<string, any>;
              if (Array.isArray(responseObj.sliderQuestions)) {
                mainSliderQuestions = responseObj.sliderQuestions;
              } else if (responseObj.questions && Array.isArray(responseObj.questions)) {
                mainSliderQuestions = responseObj.questions;
              }
            }
            
            if (mainSliderQuestions.length > 0) {
              console.log(`Found ${mainSliderQuestions.length} slider questions, syncing to public form`);
              await saveSliderQuestions(projectId, mainSliderQuestions);
              syncedSliderQuestions = mainSliderQuestions; // Update the value for the return
            }
          } else if (item.ar_activity_id === 'participant-questions' && item.ar_response) {
            // Extract participant questions - handle different possible formats
            let mainParticipantQuestions: any[] = [];
            
            if (Array.isArray(item.ar_response)) {
              mainParticipantQuestions = item.ar_response;
            } else if (isPlainObject(item.ar_response)) {
              const responseObj = item.ar_response as Record<string, any>;
              if (Array.isArray(responseObj.participantQuestions)) {
                mainParticipantQuestions = responseObj.participantQuestions;
              } else if (responseObj.questions && Array.isArray(responseObj.questions)) {
                mainParticipantQuestions = responseObj.questions;
              }
            }
            
            if (mainParticipantQuestions.length > 0) {
              console.log(`Found ${mainParticipantQuestions.length} participant questions, syncing to public form`);
              await saveParticipantQuestions(projectId, mainParticipantQuestions);
              syncedParticipantQuestions = mainParticipantQuestions; // Update the value for the return
            }
          }
        }
        
        console.log(`After sync: story question: ${syncedStoryQuestion ? 'yes' : 'no'}, 
          slider questions: ${syncedSliderQuestions?.length || 0}, 
          participant questions: ${syncedParticipantQuestions?.length || 0}`);
        
        return {
          storyQuestion: syncedStoryQuestion || "",
          sliderQuestions: syncedSliderQuestions || [],
          participantQuestions: syncedParticipantQuestions || []
        };
      }
    }
    
    console.log(`Public form data loaded: story question: ${storyQuestion ? 'yes' : 'no'}, 
      slider questions: ${sliderQuestions?.length || 0}, 
      participant questions: ${participantQuestions?.length || 0}`);
    
    return {
      storyQuestion: storyQuestion || "",
      sliderQuestions: sliderQuestions || [],
      participantQuestions: participantQuestions || []
    };
  } catch (error) {
    console.error("Error getting public form:", error);
    return null;
  }
};

/**
 * Saves a public form
 * @param projectId Project ID
 * @param formData Form data
 * @returns Success status
 */
export const savePublicForm = async (projectId: string, formData: PublicFormData): Promise<boolean> => {
  try {
    // Import needed functions dynamically to avoid circular dependencies
    const { saveStoryQuestion } = await import('./publicForm/storyQuestionService');
    const { saveSliderQuestions } = await import('./publicForm/sliderQuestionsService');
    const { saveParticipantQuestions } = await import('./publicForm/participantQuestionsService');
    
    // Save all form components
    const promises = [];
    
    // Use await to compare the result of getStoryQuestion with formData.storyQuestion
    const { getStoryQuestion } = await import('./publicForm/storyQuestionService');
    const existingStoryQuestion = await getStoryQuestion(projectId);
    if (formData.storyQuestion && existingStoryQuestion !== formData.storyQuestion) {
      promises.push(saveStoryQuestion(projectId, formData.storyQuestion));
    }
    
    promises.push(saveSliderQuestions(projectId, formData.sliderQuestions || []));
    promises.push(saveParticipantQuestions(projectId, formData.participantQuestions || []));
    
    await Promise.all(promises);
    
    return true;
  } catch (error) {
    console.error("Error saving public form:", error);
    return false;
  }
};
