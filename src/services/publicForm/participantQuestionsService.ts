
import { supabase } from "@/integrations/supabase/client";
import { ParticipantQuestion } from "../types/designTypes";
import { PUBLIC_ACTIVITY_IDS } from "./constants";
import { Json } from "@/integrations/supabase/types";
import { extractParticipantQuestions } from "./utils";

export const saveParticipantQuestions = async (projectId: string, participantQuestions: ParticipantQuestion[]): Promise<string> => {
  console.log("Saving public participant questions for project:", projectId, participantQuestions);
  try {
    // Clean and format participant questions
    const formattedParticipantQuestions = participantQuestions.map(q => ({
      id: q.id,
      label: typeof q.label === 'string' ? q.label.trim() : "",
      checked: q.checked !== undefined ? !!q.checked : false,
      choices: Array.isArray(q.choices) 
        ? q.choices.map(c => ({
            id: c.id,
            label: typeof c.label === 'string' ? c.label.trim() : ""
          }))
        : []
    }));

    // Try to use the RPC function to bypass RLS
    try {
      console.log("Using RPC function to save participant questions");
      const { data: rpcData, error: rpcError } = await supabase.rpc('insert_activity_response', {
        project_id: projectId,
        phase_id: 'collection',
        step_id: 'public-form',
        activity_id: PUBLIC_ACTIVITY_IDS.PARTICIPANT_QUESTIONS,
        response_data: { participantQuestions: formattedParticipantQuestions } as unknown as Json
      });
      
      if (rpcError) {
        console.error("Error saving participant questions via RPC:", rpcError);
        throw rpcError;
      }
      
      console.log("Successfully saved participant questions via RPC:", rpcData);
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
          ar_phase_id: 'collection',
          ar_step_id: 'public-form',
          ar_activity_id: PUBLIC_ACTIVITY_IDS.PARTICIPANT_QUESTIONS,
          ar_response: { participantQuestions: formattedParticipantQuestions } as unknown as Json
        })
        .select('id')
        .maybeSingle();

      if (insertError) {
        console.error("Error saving participant questions via direct insert:", insertError);
        throw insertError;
      }

      console.log("Successfully saved participant questions via direct insert:", data);
      return data?.id || "success";
    }
  } catch (error) {
    console.error("Failed to save public participant questions:", error);
    throw error;
  }
};

export const getParticipantQuestions = async (projectId: string): Promise<ParticipantQuestion[] | null> => {
  console.log("Fetching public participant questions for project:", projectId);
  try {
    // First try the collection/public-form path
    const { data, error } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_step_id', 'public-form')
      .eq('ar_activity_id', PUBLIC_ACTIVITY_IDS.PARTICIPANT_QUESTIONS)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!error && data?.ar_response) {
      console.log("Found public participant questions in collection/public-form");
      const questions = extractParticipantQuestions(data.ar_response);
      if (questions && questions.length > 0) {
        console.log(`Found ${questions.length} participant questions`);
        return questions;
      }
    }
    
    // If not found, try the design phase location
    console.log("Trying to get participant questions from design phase");
    const { data: designData, error: designError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'design')
      .eq('ar_step_id', 'participant-questions')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (!designError && designData?.ar_response) {
      console.log("Found participant questions in design phase");
      const questions = extractParticipantQuestions(designData.ar_response);
      if (questions && questions.length > 0) {
        console.log(`Found ${questions.length} participant questions in design phase`);
        return questions;
      }
    }

    // Also try to fetch from legacy format if still not found
    console.log("Trying to get participant questions from legacy location");
    const { data: legacyData, error: legacyError } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'collection')
      .eq('ar_activity_id', 'participant-questions')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (!legacyError && legacyData?.ar_response) {
      console.log("Found participant questions in legacy format");
      const questions = extractParticipantQuestions(legacyData.ar_response);
      if (questions && questions.length > 0) {
        console.log(`Found ${questions.length} participant questions in legacy format`);
        return questions;
      }
    }

    console.log("No public participant questions found");
    return null;
  } catch (error) {
    console.error("Failed to fetch public participant questions:", error);
    return null;
  }
};
