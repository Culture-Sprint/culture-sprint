
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { processAIResponse, extractQuestionFromLegacyResponse } from "../../storyQuestionSyncBase";

/**
 * Find a story question in all activity_responses
 */
export const findStoryQuestionInResponses = async (
  projectId: string,
  forceRefresh = false
): Promise<string | null> => {
  console.log(`Looking for story question in activity_responses for project ${projectId}`);
  
  try {
    // First try to get directly from collection/story-questions/story-questions (new consolidated path)
    const { data: consolidatedData, error: consolidatedError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_step_id', 'story-questions')
      .eq('ar_activity_id', 'story-questions')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (consolidatedError) {
      console.error(`Error fetching from consolidated path: ${consolidatedError.message}`);
    } else if (consolidatedData?.ar_response) {
      const responseData = consolidatedData.ar_response as Record<string, any>;
      if (responseData.question && typeof responseData.question === 'string') {
        console.log(`Found story question in consolidated path: ${responseData.question}`);
        return responseData.question;
      }
    }
    
    // Next try public-form/public-story-questions
    const { data: publicData, error: publicError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_step_id', 'public-form')
      .eq('ar_activity_id', 'public-story-questions')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (publicError) {
      console.error(`Error fetching from public path: ${publicError.message}`);
    } else if (publicData?.ar_response) {
      const responseData = publicData.ar_response as Record<string, any>;
      if (responseData.question && typeof responseData.question === 'string') {
        console.log(`Found story question in public path: ${responseData.question}`);
        return responseData.question;
      }
    }
    
    // Legacy: Try direct story-question from collection phase
    const { data: legacyData, error: legacyError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_step_id', 'story-question')
      .eq('ar_activity_id', 'story-question')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (legacyError) {
      console.error(`Error fetching from legacy path: ${legacyError.message}`);
    } else if (legacyData?.ar_response) {
      const responseData = legacyData.ar_response as Record<string, any>;
      if (responseData.question && typeof responseData.question === 'string') {
        console.log(`Found story question in legacy path: ${responseData.question}`);
        return responseData.question;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error in findStoryQuestionInResponses: ${error}`);
    return null;
  }
};

/**
 * Fetch from public form configuration
 */
export const fetchFromPublicFormConfiguration = async (
  projectId: string,
  forceRefresh = false
): Promise<string | null> => {
  console.log(`Looking for story question in public-form/story-question for project ${projectId}`);
  
  try {
    const { data, error } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_step_id', 'public-form')
      .eq('ar_activity_id', 'story-question')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (error) {
      console.error(`Error fetching from public form configuration: ${error.message}`);
      return null;
    }
    
    if (!data?.ar_response) {
      return null;
    }
    
    const responseData = data.ar_response as Record<string, any>;
    
    if (responseData.storyQuestion && typeof responseData.storyQuestion === 'string') {
      console.log(`Found storyQuestion in public form configuration: ${responseData.storyQuestion}`);
      return responseData.storyQuestion;
    }
    
    return null;
  } catch (error) {
    console.error(`Error in fetchFromPublicFormConfiguration: ${error}`);
    return null;
  }
};

/**
 * Process and validate the extracted question
 */
export const processExtractedQuestion = (
  extractedQuestion: string | null,
  localQuestion: string | null
): string => {
  // Process the extracted question if it exists
  if (extractedQuestion) {
    const processedQuestion = processAIResponse(extractedQuestion);
    
    if (processedQuestion && processedQuestion.trim().length > 3) {
      return processedQuestion;
    }
  }
  
  // If no valid extracted question, fall back to local question
  if (localQuestion && localQuestion.trim().length > 3) {
    return localQuestion;
  }
  
  // If all else fails, return empty string
  return "";
};
