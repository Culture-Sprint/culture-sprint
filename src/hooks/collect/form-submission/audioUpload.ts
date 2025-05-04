
// Handles uploading audio recording to Supabase Storage

import { supabase } from "@/integrations/supabase/client";

const STORAGE_BUCKET = 'story_recordings';

export const uploadAudio = async (
  audioData: string,
  projectId: string,
  storyId: string
): Promise<string | null> => {
  try {
    console.log("Uploading audio to Supabase storage...");

    const fileName = `recording_${storyId}_${Date.now()}.webm`;
    const filePath = `${projectId}/${fileName}`;

    const blob = await fetch(`data:audio/webm;base64,${audioData}`).then(r => r.blob());

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, blob, {
        contentType: 'audio/webm',
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Error uploading audio:", error);
      if (error.message.includes('permission denied')) {
        console.error("PERMISSION DENIED: Check RLS policies for storage bucket");
      }
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    console.log("Audio uploaded successfully:", publicUrlData.publicUrl);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error in uploadAudio:", error);
    return null;
  }
};
