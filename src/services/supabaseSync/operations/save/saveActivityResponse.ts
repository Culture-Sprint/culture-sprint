import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { debugSupabaseQuery } from "../core/debugUtils";
import { generateCacheKey, setCachedResponse, clearCachedResponse } from "../cache/responseCache";
import { normalizePhaseId } from "@/components/design/utils/formFieldUtils";

/**
 * Save activity response to Supabase
 */
export const saveActivityResponse = async <T>(
  projectId: string,
  phaseId: string,
  stepId: string,
  activityId: string,
  data: T,
  responseKey: string | null = null
): Promise<boolean> => {
  debugSupabaseQuery(`Saving activity response: ${phaseId}/${stepId}/${activityId}`);
  console.log(`SAVE: Attempting to save data for project=${projectId}, phase=${phaseId}, step=${stepId}, activity=${activityId}`);
  console.log(`SAVE: Data payload:`, data);
  
  if (!projectId || !phaseId || !stepId || !activityId) {
    console.error("SAVE ERROR: Missing required parameters:", { projectId, phaseId, stepId, activityId });
    return false;
  }
  
  // Data validation
  if (data === null || data === undefined) {
    console.error("SAVE ERROR: Data is null or undefined");
    return false;
  }
  
  try {
    // Create the response object
    let responseData: any;
    
    if (responseKey) {
      // If a responseKey is provided, wrap the data in an object with that key
      responseData = { [responseKey]: data };
      console.log(`SAVE: Using responseKey ${responseKey}, wrapped data:`, responseData);
    } else {
      // Otherwise, use the data directly
      responseData = data;
      console.log(`SAVE: No responseKey provided, using data directly:`, responseData);
    }
    
    // For form-appearance-editor, always ensure we use 'build' phase
    if (activityId === 'form-appearance-editor') {
      phaseId = 'build';
      console.log(`SAVE: Forcing phase to 'build' for form-appearance-editor`);
    }
    
    // Normalize the phase ID to handle both old and new naming
    const normalizedPhaseId = normalizePhaseId(phaseId);
    console.log(`SAVE: Normalized phase ID from ${phaseId} to ${normalizedPhaseId}`);
    
    // Before saving, clear any existing cache for ALL possible paths to ensure clean state
    const phaseIds = ['build', 'design', 'form-appearance', 'context', 'define'];
    for (const pid of phaseIds) {
      const cacheKey = generateCacheKey(projectId, pid, stepId, activityId);
      clearCachedResponse(cacheKey);
      console.log(`SAVE: Cleared cache for path ${pid}/${stepId}/${activityId}`);
    }

    // Check if a record already exists with both old and new phase IDs
    let existingData;
    let checkError;

    // First try with the provided phaseId
    const originalResult = await supabase
      .from('activity_responses')
      .select('id')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', phaseId)
      .eq('ar_step_id', stepId)
      .eq('ar_activity_id', activityId)
      .maybeSingle();
      
    if (originalResult.error) {
      console.error("Error checking existing record with original phaseId:", originalResult.error);
      checkError = originalResult.error;
    } else {
      existingData = originalResult.data;
    }
    
    // If not found and phaseId is different from normalizedPhaseId, try the normalized version
    if (!existingData && phaseId !== normalizedPhaseId) {
      const normalizedResult = await supabase
        .from('activity_responses')
        .select('id')
        .eq('ar_project_id', projectId)
        .eq('ar_phase_id', normalizedPhaseId)
        .eq('ar_step_id', stepId)
        .eq('ar_activity_id', activityId)
        .maybeSingle();
        
      if (normalizedResult.error) {
        console.error("Error checking existing record with normalized phaseId:", normalizedResult.error);
        if (!checkError) checkError = normalizedResult.error;
      } else {
        existingData = normalizedResult.data;
      }
    }
    
    if (checkError && !existingData) {
      console.error("Error checking existing record:", checkError);
      return false;
    }
    
    let result;
    let resultData;
    
    // Try to use upsert for reliability - this will insert if not exists or update if exists
    const { data: upsertData, error: upsertError } = await supabase
      .from('activity_responses')
      .upsert({
        ar_project_id: projectId,
        ar_phase_id: phaseId,
        ar_step_id: stepId,
        ar_activity_id: activityId,
        ar_response: responseData as Json,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'ar_project_id,ar_phase_id,ar_step_id,ar_activity_id'
      });
    
    result = !upsertError;
    resultData = upsertData;
    
    if (upsertError) {
      console.error("Error upserting record:", upsertError);
      
      // Fallback to separate update or insert if upsert fails
      if (existingData) {
        console.log(`SAVE: Found existing record with ID ${existingData.id}, updating...`);
        // Update existing record
        const { data: updateData, error: updateError } = await supabase
          .from('activity_responses')
          .update({
            ar_response: responseData as Json,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
          
        result = !updateError;
        resultData = updateData;
        if (updateError) {
          console.error("Error updating record:", updateError);
        } else {
          console.log(`SAVE: Record updated successfully`);
        }
      } else {
        console.log(`SAVE: No existing record found, creating new record with phaseId=${phaseId}...`);
        // Insert new record - always use the new phase ID for new records
        const { data: insertData, error: insertError } = await supabase
          .from('activity_responses')
          .insert({
            ar_project_id: projectId,
            ar_phase_id: phaseId,  // Use the original phaseId for consistency
            ar_step_id: stepId,
            ar_activity_id: activityId,
            ar_response: responseData as Json
          });
          
        result = !insertError;
        resultData = insertData;
        if (insertError) {
          console.error("Error inserting record:", insertError);
        } else {
          console.log(`SAVE: New record created successfully`);
        }
      }
    } else {
      console.log("SAVE: Upsert operation successful");
    }
    
    // Dispatch custom events after successful save
    if (result) {
      // Clear the cache first to ensure we don't have stale data
      for (const pid of phaseIds) {
        const cacheKey = generateCacheKey(projectId, pid, stepId, activityId);
        clearCachedResponse(cacheKey);
        console.log(`SAVE: Cleared cache for path ${pid}/${stepId}/${activityId}`);
      }
      
      // Then set the new cache for all possible paths to ensure it's found
      for (const pid of phaseIds) {
        const cacheKey = generateCacheKey(projectId, pid, stepId, activityId);
        setCachedResponse(cacheKey, responseData);
        console.log(`SAVE: Response cached with key ${cacheKey}`);
      }
      
      // Dispatch a custom event to notify other components that data has changed
      try {
        const storageKey = `activity_saved_${projectId}_${phaseId}_${stepId}_${activityId}`;
        localStorage.setItem(storageKey, Date.now().toString());
        
        // Dispatch a custom event with more detail
        const event = new CustomEvent('activity_saved', {
          detail: { 
            projectId, 
            phaseId, 
            stepId, 
            activityId,
            timestamp: Date.now() 
          }
        });
        window.dispatchEvent(event);
        
        // Also trigger a storage event for compatibility
        try {
          // Using localStorage to trigger storage event listeners
          localStorage.setItem('activity_saved', Date.now().toString());
          localStorage.setItem(`activity_${activityId}_saved`, 'true');
        } catch (err) {
          console.error('Error setting localStorage notification:', err);
        }
        
        console.log('Dispatched activity_saved events');
      } catch (err) {
        console.error('Error dispatching save notification:', err);
      }
      
      // Clear any alternative location caches that might be storing the same data type
      // This helps with keeping the cache consistent
      if ((phaseId === 'collection' || phaseId === 'design') && stepId === 'questions') {
        const altCacheKey = generateCacheKey(projectId, 'collection', 'public-form', activityId);
        sessionStorage.removeItem(`ar_cache_${altCacheKey}`);
        
        const altCacheKey2 = generateCacheKey(projectId, 'design', 'public-form', activityId);
        sessionStorage.removeItem(`ar_cache_${altCacheKey2}`);
      }
      
      if ((phaseId === 'collection' || phaseId === 'design') && stepId === 'public-form') {
        const altCacheKey = generateCacheKey(projectId, 'collection', 'questions', activityId);
        sessionStorage.removeItem(`ar_cache_${altCacheKey}`);
        
        const altCacheKey2 = generateCacheKey(projectId, 'design', 'questions', activityId);
        sessionStorage.removeItem(`ar_cache_${altCacheKey2}`);
      }
    }
    
    console.log(`SAVE: Operation result: ${result ? 'Success' : 'Failure'}`);
    return result;
  } catch (error) {
    console.error(`Error saving activity response for ${activityId}:`, error);
    return false;
  }
};
