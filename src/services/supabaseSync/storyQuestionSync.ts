
import { fetchActivityResponse } from './operations';
import { 
  DEFAULT_STORY_QUESTION,
  processAIResponse, 
  extractQuestionFromLegacyResponse 
} from './storyQuestionSyncBase';

import { 
  findStoryQuestionInResponses,
  fetchFromPublicFormConfiguration,
  processExtractedQuestion
} from './utils/storyQuestionFetchUtils';

import {
  saveToPublicStoryQuestions,
  saveToPublicFormConfiguration,
  saveToActivityResponses,
  prepareQuestionForSaving
} from './utils/storyQuestionSaveUtils';

/**
 * Retrieves the story question from Supabase for a specific project
 */
export const syncStoryQuestionFromSupabase = async (
  projectId: string,
  localQuestion: string,
  forceRefresh = false
): Promise<string> => {
  if (!projectId) {
    console.log("No project ID provided for syncStoryQuestionFromSupabase, using local question");
    return localQuestion;
  }
  
  console.log(`Fetching story question from Supabase for project ${projectId} (force refresh: ${forceRefresh})`);
  console.log(`Local question is: "${localQuestion}"`);
  
  try {
    // Clear the caches first if this is a force refresh
    if (forceRefresh) {
      try {
        // Clear all caches including the consolidated activity ID
        sessionStorage.removeItem(`ar_cache_${projectId}_collection_story-questions_story-questions`);
        sessionStorage.removeItem(`ar_cache_${projectId}_collection_public-form_story-question`);
        sessionStorage.removeItem(`ar_cache_${projectId}_collection_public-form_public-story-questions`);
        console.log(`STORY QUESTION SYNC: Cleared caches for force refresh on project ${projectId}`);
      } catch (cacheError) {
        console.error(`Error clearing cache during force refresh:`, cacheError);
      }
    }
    
    let extractedQuestion = null;
    
    // Try to find the question in all activity responses first
    extractedQuestion = await findStoryQuestionInResponses(projectId, forceRefresh);
    
    // If direct query didn't work, try the old methods
    if (!extractedQuestion) {
      // Try to fetch from the public form configuration
      extractedQuestion = await fetchFromPublicFormConfiguration(projectId, forceRefresh);
      
      // If not found in public form, try consolidated activity_responses
      if (!extractedQuestion) {
        console.log(`STORY QUESTION SYNC: Trying consolidated activity_responses table for project ${projectId}`);
        
        const responseData = await fetchActivityResponse(
          projectId,
          'collection', 
          'story-questions',
          'story-questions',
          { question: localQuestion },
          'question',
          forceRefresh // Pass through the force refresh flag
        );
        
        if (responseData) {
          extractedQuestion = extractQuestionFromLegacyResponse(responseData);
        }
      }
    }
    
    // Process and validate the extracted question
    const finalQuestion = processExtractedQuestion(extractedQuestion, localQuestion);
    console.log(`STORY QUESTION SYNC: Final question after sync for project ${projectId}: "${finalQuestion}"`);
    return finalQuestion;
  } catch (error) {
    console.error(`Error fetching story question from Supabase for project ${projectId}:`, error);
    return localQuestion && localQuestion.trim().length > 3 
      ? localQuestion
      : DEFAULT_STORY_QUESTION;
  }
};

/**
 * Saves the story question to Supabase for a specific project
 */
export const saveStoryQuestionToSupabase = async (
  projectId: string,
  question: string
): Promise<boolean> => {
  if (!projectId) {
    console.warn("No project ID provided for saveStoryQuestionToSupabase");
    return false;
  }
  
  console.log(`Saving story question to Supabase for project ${projectId}:`, question);
  
  try {
    // Clear all potential caches before saving to ensure no stale data
    try {
      // Clear all caches including the consolidated activity ID
      sessionStorage.removeItem(`ar_cache_${projectId}_collection_story-questions_story-questions`);
      sessionStorage.removeItem(`ar_cache_${projectId}_collection_public-form_story-question`);
      sessionStorage.removeItem(`ar_cache_${projectId}_collection_public-form_public-story-questions`);
      console.log(`STORY QUESTION SYNC: Cleared caches before save for project ${projectId}`);
    } catch (cacheError) {
      console.error(`Error clearing cache before save:`, cacheError);
    }
    
    // Validate and process the question
    const processedQuestion = prepareQuestionForSaving(question);
    if (!processedQuestion) return false;
    
    try {
      // Save to the consolidated activity ID first
      const consolidatedSaveSuccess = await saveToActivityResponses(projectId, processedQuestion);

      // Also try the public-story-questions service
      const directSaveSuccess = await saveToPublicStoryQuestions(projectId, processedQuestion);
      
      // Also try the legacy service
      const publicFormSuccess = await saveToPublicFormConfiguration(projectId, processedQuestion);
      
      const saveSuccess = consolidatedSaveSuccess || directSaveSuccess || publicFormSuccess;
      console.log(`STORY QUESTION SYNC: Save result for project ${projectId}: ${saveSuccess} (consolidated: ${consolidatedSaveSuccess}, direct: ${directSaveSuccess}, publicForm: ${publicFormSuccess})`);
      
      return saveSuccess;
    } catch (directError) {
      console.error(`STORY QUESTION SYNC: Error with direct save: ${directError}`);
      
      // Fall back to the traditional methods
      const publicFormSuccess = await saveToPublicFormConfiguration(projectId, processedQuestion);
      return publicFormSuccess;
    }
  } catch (error) {
    console.error(`Error saving story question to Supabase for project ${projectId}:`, error);
    return false;
  }
};
