
import { supabase } from "@/integrations/supabase/client";
import { StoryData, SliderResponseData } from './types';

/**
 * Save slider responses to the database
 * @param formData The form submission data containing slider responses
 * @param storyId The ID of the story these responses belong to
 * @returns Promise resolving when the operation completes
 */
export const saveSliderResponses = async (
  formData: StoryData,
  storyId: string
): Promise<void> => {
  // Skip if no slider responses
  if (!formData.sliderResponses || formData.sliderResponses.length === 0) {
    console.log("No slider responses to save");
    return;
  }
  
  console.log(`Preparing to save ${formData.sliderResponses.length} slider responses for story ${storyId}`);
  const sliderInserts = prepareSliderResponsesData(formData, storyId);
  
  if (sliderInserts.length > 0) {
    console.log(`Starting to save ${sliderInserts.length} slider responses to database`);
    
    // Insert each slider response individually to avoid type issues
    const insertPromises = sliderInserts.map(item => {
      // Ensure question_id is always converted to a number for database compatibility
      const preparedItem = {
        ...item,
        question_id: typeof item.question_id === 'string' ? 
          parseInt(item.question_id, 10) || 0 : // Convert strings to numbers, default to 0 if NaN
          item.question_id,
        story_id: storyId // Explicitly set story_id to ensure it's included
      };
      
      console.log(`Inserting slider response:`, preparedItem);
      
      return supabase
        .from('slider_responses')
        .insert(preparedItem);
    });
    
    try {
      const results = await Promise.all(insertPromises);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) {
        console.error("Errors saving some slider responses:", errors);
      } else {
        console.log(`Successfully saved ${sliderInserts.length} slider responses`);
      }
    } catch (error) {
      console.error("Error saving slider responses:", error);
    }
  }
};

/**
 * Prepare slider response data from form submission for database insertion
 * @param formData The form submission data containing slider responses
 * @param storyId The ID of the story these responses belong to
 * @returns Array of prepared slider response data objects
 */
export const prepareSliderResponsesData = (formData: StoryData, storyId: string): SliderResponseData[] => {
  const sliderInserts: SliderResponseData[] = [];
  
  if (formData.sliderResponses && formData.sliderResponses.length > 0) {
    console.log(`Processing ${formData.sliderResponses.length} slider responses for story ${storyId}`);
    
    formData.sliderResponses.forEach(slider => {
      // Skip sliders with null values
      if (slider.value === null && slider.responseType !== 'answered') {
        console.log(`Skipping slider ${slider.questionId} with null value and not answered`);
        return;
      }
      
      sliderInserts.push({
        story_id: storyId,
        question_id: slider.questionId,
        question_text: slider.questionText,
        value: slider.value,
        response_type: slider.responseType || "answered",
        left_label: slider.leftLabel,
        right_label: slider.rightLabel,
        sr_project_id: formData.projectId
      });
      
      console.log(`Prepared slider response for question ${slider.questionId}: ${slider.questionText}, value: ${slider.value}`);
    });
  }
  
  return sliderInserts;
};
