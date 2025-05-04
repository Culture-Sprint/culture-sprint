
// Main logic for saving a story, imports demo/audio modules

import { supabase } from "@/integrations/supabase/client";
import { StoryData } from './types';
import { uploadAudio } from './audioUpload';
import { requestTranscription, updateStoryWithTranscription } from './audioTranscription';
import { isUserDemo, getProjectStoryCount, MAX_DEMO_STORIES } from './demoUserLimit';

// Function to save a story (audio+transcription handled externally)
export const saveStory = async (
  formData: StoryData,
  projectId?: string,
  userId?: string,
  isPublic: boolean = false
): Promise<string | null> => {
  try {
    const title = formData.title || '';
    const { text, emotionalResponse, additionalComments, isImported = false, audioData } = formData;
    const finalProjectId = formData.projectId || projectId;

    // For authenticated submissions, project ID is required
    if (!finalProjectId && !isPublic) {
      console.error("DB SAVE ERROR - No project ID provided for authenticated story submission");
      throw new Error("Project ID is required");
    }

    // Demo user/project limit
    if (userId && finalProjectId) {
      const isDemo = await isUserDemo(userId);
      if (isDemo) {
        const currentStoryCount = await getProjectStoryCount(finalProjectId);

        if (currentStoryCount >= MAX_DEMO_STORIES) {
          return "demo-limit-reached";
        }
      }
    }

    // Prepare insert payload
    let audioUrl = null;
    interface StoryDataInsert {
      title: string;
      text: string;
      emotional_response: string;
      additional_comments?: string;
      is_public: boolean;
      is_imported: boolean;
      user_id: string | null;
      st_project_id: string | null;
      has_audio?: boolean;
    }

    const storyData: StoryDataInsert = {
      title,
      text,
      emotional_response: emotionalResponse,
      additional_comments: additionalComments,
      is_public: isPublic,
      is_imported: isImported || false,
      user_id: userId || null,
      st_project_id: finalProjectId || null,
    };

    if (formData.hasAudio) {
      storyData.has_audio = Boolean(formData.hasAudio);
    }

    // Insert to stories
    const { data, error } = await supabase
      .from('stories')
      .insert(storyData)
      .select('id')
      .single();

    if (error) {
      if (isPublic) {
        return "error-but-continue";
      }
      throw error;
    }

    const storyId = data?.id;

    // Handle audio (upload + transcription)
    if (audioData && storyId && finalProjectId) {
      try {
        audioUrl = await uploadAudio(audioData, finalProjectId, storyId);

        if (audioUrl) {
          const { error: audioUpdateError } = await supabase
            .from('stories')
            .update({ audio_url: audioUrl })
            .eq('id', storyId);

          if (!audioUpdateError) {
            // Run transcription task, but allow if it fails
            const transcription = await requestTranscription(audioData, storyId);
            if (transcription) {
              await updateStoryWithTranscription(storyId, transcription);
            }
          }
        }
      } catch (mediaError) {
        console.error("Error processing audio:", mediaError);
      }
    }

    return storyId || "public-story-saved";
  } catch (error) {
    if (isPublic) {
      return "error-but-continue";
    }
    return null;
  }
};
