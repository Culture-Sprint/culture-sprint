
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_ACTIVITY_IDS } from "./constants";
import { Json } from "@/integrations/supabase/types";
import { isPlainObject } from "./types";

export const saveStoryQuestion = async (projectId: string, storyQuestion: string): Promise<string> => {
  console.log("Saving public story question for project:", projectId, storyQuestion);
  try {
    // First check if record exists
    const { data: existingData, error: checkError } = await supabase
      .from('activity_responses')
      .select('id')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_step_id', 'public-form')
      .eq('ar_activity_id', PUBLIC_ACTIVITY_IDS.STORY_QUESTION)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking for existing public story question:", checkError);
      throw checkError;
    }
    
    let result;
    
    if (existingData) {
      // Update existing record
      console.log("Updating existing public story question record");
      const { data, error } = await supabase
        .from('activity_responses')
        .update({
          ar_response: { storyQuestion } as unknown as Json,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id)
        .select('id')
        .maybeSingle();
        
      if (error) {
        console.error("Error updating public story question:", error);
        throw error;
      }
      
      result = data;
    } else {
      // Try to use the RPC function which might bypass RLS
      console.log("Creating new public story question record using RPC function");
      try {
        const { data, error } = await supabase.rpc('insert_activity_response', {
          project_id: projectId,
          phase_id: 'collection',
          step_id: 'public-form',
          activity_id: PUBLIC_ACTIVITY_IDS.STORY_QUESTION,
          response_data: { storyQuestion } as unknown as Json,
          updated_at: new Date().toISOString()
        });
        
        if (error) {
          console.error("Error using RPC to save story question:", error);
          throw error;
        }
        
        console.log("RPC function returned:", data);
        if (typeof data === 'object' && data !== null && 'id' in data) {
          result = { id: data.id };
        } else {
          // Fallback to direct insert
          throw new Error("RPC returned unexpected format, falling back to direct insert");
        }
      } catch (rpcError) {
        // Fallback to direct insert if RPC fails
        console.warn("RPC method failed, trying direct insert:", rpcError);
        const { data, error } = await supabase
          .from('activity_responses')
          .insert({
            ar_project_id: projectId,
            ar_phase_id: 'collection',
            ar_step_id: 'public-form',
            ar_activity_id: PUBLIC_ACTIVITY_IDS.STORY_QUESTION,
            ar_response: { storyQuestion } as unknown as Json
          })
          .select('id')
          .maybeSingle();
          
        if (error) {
          console.error("Error with direct insert of public story question:", error);
          throw error;
        }
        
        result = data;
      }
    }

    console.log("Successfully saved public story question:", result);
    return result?.id || "success";
  } catch (error) {
    console.error("Failed to save public story question:", error);
    throw error;
  }
};

export const getStoryQuestion = async (projectId: string): Promise<string | null> => {
  console.log("Fetching public story question for project:", projectId);
  try {
    const { data, error } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_step_id', 'public-form')
      .eq('ar_activity_id', PUBLIC_ACTIVITY_IDS.STORY_QUESTION)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching public story question:", error);
      return null;
    }

    if (!data || !data.ar_response) {
      console.log("No public story question found");
      return null;
    }

    if (!isPlainObject(data.ar_response)) return null;
    
    const response = data.ar_response as Record<string, any>;
    
    if ('storyQuestion' in response && typeof response.storyQuestion === 'string') {
      console.log("Found story question:", response.storyQuestion);
      return response.storyQuestion.trim();
    }
    
    return null;
  } catch (error) {
    console.error("Failed to fetch public story question:", error);
    return null;
  }
};
