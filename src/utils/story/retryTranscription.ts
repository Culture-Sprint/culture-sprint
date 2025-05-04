
import { supabase } from "@/integrations/supabase/client";

export const retryTranscription = async (audioUrl: string, storyId: string | number): Promise<string | null> => {
  try {
    // Fetch audio file as blob
    const response = await fetch(audioUrl);
    if (!response.ok) throw new Error("Audio file not found");

    const audioBlob = await response.blob();
    // Convert Blob to base64
    const reader = new FileReader();
    const audioBase64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const base64 = reader.result.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert audio to base64"));
        }
      };
      reader.onerror = reject;
    });
    reader.readAsDataURL(audioBlob);
    const audioBase64 = await audioBase64Promise;

    // Call the transcription edge function
    const { data, error } = await supabase.functions.invoke("voice-to-text", {
      body: { audio: audioBase64 }
    });

    if (error) throw error;
    if (!data || !data.text) throw new Error("No transcription returned");

    // Update the story's text field with the new transcription
    // Convert storyId to string if it's a number
    const storyIdString = String(storyId);
    
    const { error: updateErr } = await supabase
      .from("stories")
      .update({ text: data.text })
      .eq("id", storyIdString);

    if (updateErr) throw updateErr;

    return data.text;
  } catch (err: any) {
    console.error("Retry transcription error:", err);
    throw err; // Let the caller handle error display
  }
};
