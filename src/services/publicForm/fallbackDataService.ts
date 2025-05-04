
import { supabase } from "@/integrations/supabase/client";
import { PublicFormData, isPlainObject } from "./types";
import { extractStoryQuestion, extractSliderQuestions, extractParticipantQuestions } from "./utils";

// Attempt to fetch form data from alternate sources as a fallback
export const fetchFormDataFromAlternateSources = async (projectId: string): Promise<PublicFormData | null> => {
  console.log("Attempting to fetch form data from alternate sources for project:", projectId);
  
  try {
    // ----- PLANNING PHASE FALLBACK -----
    // Attempt to get story question from the planning phase
    const { data: designData, error: designError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'planning')
      .eq('ar_step_id', 'story-question')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (designError) {
      console.error("Error fetching story question from planning phase:", designError);
    }
    
    // Get slider questions from the planning phase
    const { data: sliderData, error: sliderError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'planning')
      .eq('ar_step_id', 'slider-questions')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
        
    if (sliderError) {
      console.error("Error fetching slider questions from planning phase:", sliderError);
    }
    
    // Get participant questions from the planning phase
    const { data: participantData, error: participantError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'planning')
      .eq('ar_step_id', 'participant-questions')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (participantError) {
      console.error("Error fetching participant questions from planning phase:", participantError);
    }
      
    // ----- DATA EXTRACTION -----
    // Use safe type checking for all response data
    let storyQuestionFromDesign = "";  // Changed default to empty string
    let sliderQuestionsFromDesign: any[] = [];
    let participantQuestionsFromDesign: any[] = [];
    
    // Parse story question if available
    if (designData?.ar_response) {
      console.log("Found design data:", typeof designData.ar_response);
      const storyQuestion = extractStoryQuestion(designData.ar_response);
      if (storyQuestion) storyQuestionFromDesign = storyQuestion;
    }
    
    // Parse slider questions if available
    if (sliderData?.ar_response) {
      console.log("Found slider data:", typeof sliderData.ar_response);
      const sliderQuestions = extractSliderQuestions(sliderData.ar_response);
      if (sliderQuestions) sliderQuestionsFromDesign = sliderQuestions;
    }
    
    // Parse participant questions if available
    if (participantData?.ar_response) {
      console.log("Found participant data:", typeof participantData.ar_response);
      const participantQuestions = extractParticipantQuestions(participantData.ar_response);
      if (participantQuestions) participantQuestionsFromDesign = participantQuestions;
    }
      
    // Attempt another fallback to collection phase data if planning phase didn't work
    if (!designData?.ar_response && !sliderData?.ar_response && !participantData?.ar_response) {
      console.log("No planning phase data found, trying collection phase data...");
      
      // Try to fetch directly from collection/questions
      const { data: collectionData, error: collectionError } = await supabase
        .from('activity_responses')
        .select('ar_response, ar_activity_id')
        .eq('ar_project_id', projectId)
        .eq('ar_phase_id', 'collection')
        .eq('ar_step_id', 'questions')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (!collectionError && collectionData.length > 0) {
        console.log(`Found ${collectionData.length} records in collection/questions`);
        
        // Process each record to extract relevant data
        for (const record of collectionData) {
          if (!record.ar_response) continue;
          
          console.log(`Processing record with activity_id ${record.ar_activity_id}`);
          
          if (record.ar_activity_id === 'story-question') {
            const storyQuestion = extractStoryQuestion(record.ar_response);
            if (storyQuestion) {
              storyQuestionFromDesign = storyQuestion;
              console.log("Extracted story question from collection phase");
            }
          } else if (record.ar_activity_id === 'slider-questions') {
            const sliderQuestions = extractSliderQuestions(record.ar_response);
            if (sliderQuestions && sliderQuestions.length > 0) {
              sliderQuestionsFromDesign = sliderQuestions;
              console.log("Extracted slider questions from collection phase");
            }
          } else if (record.ar_activity_id === 'participant-questions') {
            const participantQuestions = extractParticipantQuestions(record.ar_response);
            if (participantQuestions && participantQuestions.length > 0) {
              participantQuestionsFromDesign = participantQuestions;
              console.log("Extracted participant questions from collection phase");
            }
          }
        }
      }
    }
    
    console.log("Data extracted from alternate sources:", {
      storyQuestion: storyQuestionFromDesign?.substring(0, 30) + "...",
      sliderQuestionsCount: sliderQuestionsFromDesign?.length || 0,
      participantQuestionsCount: participantQuestionsFromDesign?.length || 0
    });
    
    // If we found ANY data from alternate sources, use it
    if (storyQuestionFromDesign || sliderQuestionsFromDesign.length > 0 || participantQuestionsFromDesign.length > 0) {
      return {
        storyQuestion: storyQuestionFromDesign,
        sliderQuestions: sliderQuestionsFromDesign,
        participantQuestions: participantQuestionsFromDesign
      };
    }
    
    return null;
  } catch (fallbackError) {
    console.error("Error in fallback to alternate data sources:", fallbackError);
    return null;
  }
};
