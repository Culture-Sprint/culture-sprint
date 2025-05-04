import { supabase } from "@/integrations/supabase/client";
import { SliderQuestion } from "../types/designTypes";
import { PUBLIC_ACTIVITY_IDS } from "./constants";
import { Json } from "@/integrations/supabase/types";
import { cleanSliderQuestion, extractSliderQuestions } from "./utils";
import { CANONICAL_SLIDER_LOCATION, PUBLIC_FORM_SLIDER_LOCATION } from "@/services/supabaseSync/migrations/sliderQuestionsMigration";
import { FetchActivityResponseResult } from "@/services/supabaseSync/types/responseTypes";

export const saveSliderQuestions = async (projectId: string, sliderQuestions: SliderQuestion[]): Promise<string> => {
  console.log(`Saving slider questions for project: ${projectId}, count: ${sliderQuestions.length}`);
  try {
    // Make sure we have clean slider questions data
    const cleanedQuestions = sliderQuestions.map(cleanSliderQuestion);

    // Try to use the RPC function to bypass RLS
    try {
      console.log("Using RPC function to save slider questions to canonical location");
      const { data: rpcData, error: rpcError } = await supabase.rpc('insert_activity_response', {
        project_id: projectId,
        phase_id: CANONICAL_SLIDER_LOCATION.phase,
        step_id: CANONICAL_SLIDER_LOCATION.step,
        activity_id: CANONICAL_SLIDER_LOCATION.activity,
        response_data: { sliderQuestions: cleanedQuestions } as unknown as Json
      });
      
      if (rpcError) {
        console.error("Error saving slider questions via RPC:", rpcError);
        throw rpcError;
      }
      
      // Also save to public form location
      console.log("Also saving to public form location");
      await supabase.rpc('insert_activity_response', {
        project_id: projectId,
        phase_id: PUBLIC_FORM_SLIDER_LOCATION.phase,
        step_id: PUBLIC_FORM_SLIDER_LOCATION.step,
        activity_id: PUBLIC_FORM_SLIDER_LOCATION.activity,
        response_data: { sliderQuestions: cleanedQuestions } as unknown as Json
      });
      
      // Also save to the legacy location for maximum compatibility
      console.log("Also saving to legacy location");
      await supabase.rpc('insert_activity_response', {
        project_id: projectId,
        phase_id: 'collection',
        step_id: 'public-form',
        activity_id: PUBLIC_ACTIVITY_IDS.LEGACY_FORM_CONFIG,
        response_data: { sliderQuestions: cleanedQuestions } as unknown as Json
      });
      
      console.log("Successfully saved slider questions via RPC:", rpcData);
      // Check if rpcData exists and has an id property before accessing it
      if (typeof rpcData === 'object' && rpcData !== null && 'id' in rpcData) {
        return (rpcData as {id: string}).id;
      }
      return "success";
    } catch (error) {
      console.error("RPC method failed, falling back to direct insert:", error);
      
      // Fallback to direct insert
      const { data, error: insertError } = await supabase
        .from('activity_responses')
        .insert({
          ar_project_id: projectId,
          ar_phase_id: CANONICAL_SLIDER_LOCATION.phase,
          ar_step_id: CANONICAL_SLIDER_LOCATION.step,
          ar_activity_id: CANONICAL_SLIDER_LOCATION.activity,
          ar_response: { sliderQuestions: cleanedQuestions } as unknown as Json
        })
        .select('id')
        .maybeSingle();

      if (insertError) {
        console.error("Error saving slider questions via direct insert:", insertError);
        throw insertError;
      }

      // Also save to public form location
      try {
        await supabase
          .from('activity_responses')
          .insert({
            ar_project_id: projectId,
            ar_phase_id: PUBLIC_FORM_SLIDER_LOCATION.phase,
            ar_step_id: PUBLIC_FORM_SLIDER_LOCATION.step,
            ar_activity_id: PUBLIC_FORM_SLIDER_LOCATION.activity,
            ar_response: { sliderQuestions: cleanedQuestions } as unknown as Json
          });
          
        // Also save to legacy location
        await supabase
          .from('activity_responses')
          .insert({
            ar_project_id: projectId,
            ar_phase_id: 'collection',
            ar_step_id: 'public-form',
            ar_activity_id: PUBLIC_ACTIVITY_IDS.LEGACY_FORM_CONFIG,
            ar_response: { sliderQuestions: cleanedQuestions } as unknown as Json
          });
      } catch (publicFormError) {
        console.error("Error saving to public form location:", publicFormError);
        // Continue even if this fails
      }

      console.log("Successfully saved slider questions via direct insert:", data);
      return data?.id || "success";
    }
  } catch (error) {
    console.error("Failed to save slider questions:", error);
    throw error;
  }
};

export const getSliderQuestions = async (projectId: string, isTemplateProject: boolean = false): Promise<SliderQuestion[] | null> => {
  console.log("SliderQuestionsService - Fetching slider questions for project:", projectId, "isTemplate:", isTemplateProject);
  
  try {
    // First try to fetch from canonical location
    console.log("Trying canonical location");
    let queryBuilder = supabase
      .from('activity_responses')
      .select('ar_response, created_at')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', CANONICAL_SLIDER_LOCATION.phase)
      .eq('ar_step_id', CANONICAL_SLIDER_LOCATION.step)
      .eq('ar_activity_id', CANONICAL_SLIDER_LOCATION.activity)
      .order('created_at', { ascending: false })
      .limit(1);
      
    // If it's a template project, try to use the RPC function to bypass RLS
    if (isTemplateProject) {
      try {
        console.log("Using RPC function for template project");
        const { data: rpcData, error: rpcError } = await supabase.rpc('fetch_activity_response', {
          project_id: projectId,
          phase_id: CANONICAL_SLIDER_LOCATION.phase,
          step_id: CANONICAL_SLIDER_LOCATION.step,
          activity_id: CANONICAL_SLIDER_LOCATION.activity
        });
        
        if (!rpcError && rpcData) {
          console.log("Found slider questions via RPC in canonical location");
          
          // Type checking for RPC response
          if (typeof rpcData === 'object' && !Array.isArray(rpcData)) {
            // Cast to the expected interface type and check if it has the found property
            const typedResponse = rpcData as unknown as FetchActivityResponseResult;
            
            if (typedResponse.found && typedResponse.data && typedResponse.data.ar_response) {
              const questions = extractSliderQuestions(typedResponse.data.ar_response);
              if (questions && questions.length > 0) {
                console.log(`Found ${questions.length} slider questions via RPC`);
                return questions;
              }
            }
          }
        }
      } catch (rpcError) {
        console.error("RPC fetch failed, falling back to direct query:", rpcError);
      }
    }
    
    // Standard query if RPC didn't work or not a template
    const { data, error } = await queryBuilder.maybeSingle();

    if (!error && data?.ar_response) {
      console.log("Found slider questions in canonical location");
      const questions = extractSliderQuestions(data.ar_response);
      if (questions && questions.length > 0) {
        console.log(`Found ${questions.length} slider questions in canonical location`);
        return questions;
      }
    }
    
    // Try public form location next
    console.log("Trying public form location");
    const { data: publicFormData, error: publicFormError } = await supabase
      .from('activity_responses')
      .select('ar_response, created_at')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', PUBLIC_FORM_SLIDER_LOCATION.phase)
      .eq('ar_step_id', PUBLIC_FORM_SLIDER_LOCATION.step)
      .eq('ar_activity_id', PUBLIC_FORM_SLIDER_LOCATION.activity)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!publicFormError && publicFormData?.ar_response) {
      console.log("Found slider questions in public form location");
      const questions = extractSliderQuestions(publicFormData.ar_response);
      if (questions && questions.length > 0) {
        console.log(`Found ${questions.length} slider questions in public form location`);
        return questions;
      }
    }
    
    // Also try to get slider questions from the private form location
    console.log("Trying to get from private design location as fallback");
    const { data: designData, error: designError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'design')
      .eq('ar_step_id', 'slider-questions')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (!designError && designData?.ar_response) {
      console.log("Found slider questions in design phase");
      const questions = extractSliderQuestions(designData.ar_response);
      if (questions && questions.length > 0) {
        console.log(`Found ${questions.length} slider questions in design phase`);
        return questions;
      }
    }
    
    // Fallback to legacy format if not found
    console.log("Trying legacy location");
    const { data: legacyData, error: legacyError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_step_id', 'public-form')
      .eq('ar_activity_id', PUBLIC_ACTIVITY_IDS.LEGACY_FORM_CONFIG)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (!legacyError && legacyData?.ar_response) {
      console.log("Found slider questions in legacy format");
      const questions = extractSliderQuestions(legacyData.ar_response);
      if (questions && questions.length > 0) {
        console.log(`Found ${questions.length} slider questions in legacy format`);
        return questions;
      }
    }
    
    // Also check for slider questions stored directly in the response field
    const { data: directData, error: directError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_activity_id', 'slider-questions')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (!directError && directData?.ar_response) {
      console.log("Found slider questions in direct format");
      const questions = extractSliderQuestions(directData.ar_response);
      if (questions && questions.length > 0) {
        console.log(`Found ${questions.length} slider questions in direct format`);
        return questions;
      }
    }
    
    console.log("No slider questions found in any location");
    return null;
  } catch (error) {
    console.error("Failed to fetch slider questions:", error);
    return null;
  }
};
