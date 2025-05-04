
import { supabase } from "@/integrations/supabase/client";
import { Story } from "@/types/story";
import { formatStoryResponse } from "@/utils/story/formattingUtils";
import { fetchSliderResponsesForProject } from "./fetchSliderResponses";
import { fetchParticipantResponsesForProject } from "./fetchParticipantResponses";
import { determineEmotionLocally } from "@/components/dashboard/slider-insights/hooks/utils/emotionUtils";
import { categorizeEmotion } from "@/utils/sentimentAnalysis";

/**
 * Fetches stories from the database for a specific project
 * @param projectId The project ID to fetch stories for
 * @returns An array of formatted story objects
 */
export const fetchStoriesForProject = async (projectId: string | undefined): Promise<Story[]> => {
  console.log("STORY SERVICE - Fetching stories for project:", projectId);
  
  if (!projectId) {
    console.log("STORY SERVICE - No project ID provided, returning empty array");
    return [];
  }
  
  try {
    // First, just fetch the stories without related data
    const { data: storiesData, error: storiesError } = await supabase
      .from('stories')
      .select(`
        id,
        title,
        text,
        emotional_response,
        additional_comments,
        created_at,
        is_public,
        is_imported,
        user_id,
        st_project_id
      `)
      .eq('st_project_id', projectId)
      .order('created_at', { ascending: false });
    
    if (storiesError) {
      console.error("STORY SERVICE - Error fetching stories:", storiesError);
      throw storiesError;
    }
    
    console.log(`STORY SERVICE - Found ${storiesData?.length || 0} stories for project ${projectId}`);
    
    if (!storiesData || storiesData.length === 0) {
      return [];
    }
    
    // Get all story IDs for batch operations
    const storyIds = storiesData.map(story => story.id);
    
    // Fetch slider responses and participant responses in parallel using the correct project_id column
    const [sliderResponsesData, participantResponsesData] = await Promise.all([
      fetchSliderResponsesForProject(projectId, storyIds),
      fetchParticipantResponsesForProject(projectId, storyIds)
    ]);
    
    console.log(`STORY SERVICE - Loaded ${sliderResponsesData.length} slider responses and ${participantResponsesData.length} participant responses`);
    
    // Process each story with its responses
    const storyPromises = storiesData.map(async story => {
      // Filter responses for this specific story
      const storySliderResponses = sliderResponsesData.filter(response => response.story_id === story.id);
      const storyParticipantResponses = participantResponsesData.filter(response => response.story_id === story.id);
      
      console.log(`STORY SERVICE - Story ${story.id} has ${storySliderResponses.length} slider responses and ${storyParticipantResponses.length} participant responses`);
      
      // Pre-classify emotion locally for better performance
      let feelingSentiment: "positive" | "negative" | "neutral" | undefined;
      if (story.emotional_response) {
        const localEmotion = determineEmotionLocally(story.emotional_response);
        
        if (localEmotion !== "unknown") {
          feelingSentiment = localEmotion;
          console.log(`STORY SERVICE - Locally classified ${story.id} feeling "${story.emotional_response}" as "${localEmotion}"`);
        } else {
          // Only call the API if local classification fails and the emotion is not unspecified
          if (story.emotional_response && story.emotional_response !== "unspecified") {
            try {
              console.log(`STORY SERVICE - Local classification failed for "${story.emotional_response}", calling API`);
              feelingSentiment = await categorizeEmotion(story.emotional_response);
              console.log(`STORY SERVICE - API classified ${story.id} feeling "${story.emotional_response}" as "${feelingSentiment}"`);
            } catch (error) {
              console.error(`STORY SERVICE - Error classifying emotion via API:`, error);
              feelingSentiment = undefined;
            }
          }
        }
      }
      
      // Format the story with its responses and pre-classified sentiment
      return formatStoryResponse(
        story, 
        storySliderResponses, 
        storyParticipantResponses,
        feelingSentiment
      );
    });
    
    // Wait for all the formatted stories to be ready
    const formattedStories = await Promise.all(storyPromises);
    
    return formattedStories as Story[];
  } catch (error) {
    console.error("STORY SERVICE - Error in fetchStoriesForProject:", error);
    throw error;
  }
};
