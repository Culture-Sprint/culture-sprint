
// Handles requesting transcription and updating story with transcription

import { supabase } from "@/integrations/supabase/client";

export const requestTranscription = async (
  audioData: string,
  storyId: string
): Promise<string | null> => {
  try {
    console.log("Requesting audio transcription...");

    const { data, error } = await supabase.functions.invoke('voice-to-text', {
      body: { audio: audioData }
    });

    if (error) {
      console.error("Error invoking voice-to-text function:", error);
      return null;
    }

    if (!data || !data.text) {
      console.error("No transcription returned");
      return null;
    }

    console.log("Transcription received:", data.text);
    return data.text;
  } catch (error) {
    console.error("Error in requestTranscription:", error);
    return null;
  }
};

export const updateStoryWithTranscription = async (
  storyId: string,
  transcription: string
): Promise<boolean> => {
  try {
    console.log("Updating story with transcription...");

    const { error } = await supabase
      .from('stories')
      .update({ text: transcription })
      .eq('id', storyId);

    if (error) {
      console.error("Error updating story with transcription:", error);
      return false;
    }

    console.log("Story updated with transcription successfully");
    return true;
  } catch (error) {
    console.error("Error in updateStoryWithTranscription:", error);
    return false;
  }
};
