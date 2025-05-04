
import { supabase } from "@/integrations/supabase/client";
import { debugSupabaseQuery } from "../core/debugUtils";
import { generateCacheKey, getCachedResponse, setCachedResponse } from "../cache/responseCache";
import { normalizePhaseId } from "@/components/design/utils/formFieldUtils";
import { FetchActivityResponseResult } from "../../types/responseTypes";

/**
 * Fetch activity response from Supabase
 */
export const fetchActivityResponse = async <T>(
  projectId: string,
  phaseId: string,
  stepId: string,
  activityId: string,
  defaultValue: T = null as unknown as T,
  responseKey: string | null = null,
  forceRefresh: boolean = false
): Promise<T> => {
  debugSupabaseQuery(`Fetching activity response: ${phaseId}/${stepId}/${activityId}`);
  
  try {
    // Normalize the phase ID to handle both old and new naming
    const normalizedPhaseId = normalizePhaseId(phaseId);
    
    // Check cache first if not forcing refresh
    const cachedResult = await tryGetFromCache<T>(
      projectId, 
      phaseId, 
      normalizedPhaseId, 
      stepId, 
      activityId, 
      responseKey, 
      forceRefresh
    );
    
    if (cachedResult !== null) {
      return cachedResult;
    }
    
    // Check if this is a template project
    const isTemplateProject = await checkIfTemplateProject(projectId);
    
    // First try with the original phaseId
    let result = await fetchFromSupabase<T>(
      projectId, 
      phaseId, 
      stepId, 
      activityId, 
      isTemplateProject
    );
    
    // If not found and normalized phase is different, try with normalized phaseId
    if (!result && phaseId !== normalizedPhaseId) {
      console.log(`FETCH: Not found with original phase, trying normalized phase ${normalizedPhaseId}`);
      result = await fetchFromSupabase<T>(
        projectId, 
        normalizedPhaseId, 
        stepId, 
        activityId, 
        isTemplateProject
      );
      
      // If found with normalized phaseId, cache it with both keys
      if (result) {
        cacheResponse(projectId, phaseId, normalizedPhaseId, stepId, activityId, result);
      }
    }
    
    if (result) {
      // Extract specific key if requested
      if (responseKey && typeof result === 'object' && result !== null && responseKey in (result as object)) {
        return (result as any)[responseKey];
      }
      return result;
    }
    
    debugSupabaseQuery(`No activity response found for ${activityId}`);
    return defaultValue;
  } catch (error) {
    console.error(`Error fetching activity response for ${activityId}:`, error);
    return defaultValue;
  }
};

/**
 * Try to get activity response from cache
 */
const tryGetFromCache = async <T>(
  projectId: string,
  phaseId: string,
  normalizedPhaseId: string,
  stepId: string,
  activityId: string,
  responseKey: string | null,
  forceRefresh: boolean
): Promise<T | null> => {
  if (forceRefresh) {
    console.log(`Force refresh requested for ${activityId}, bypassing cache`);
    return null;
  }
  
  // Generate cache key for original phaseId
  const originalCacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
  
  // First check if we have cached data with original phaseId
  const cachedData = getCachedResponse<T>(originalCacheKey, responseKey);
  
  if (cachedData) {
    console.log(`Using cached data for ${activityId} with original phase ${phaseId}`);
    return cachedData;
  }
  
  // If normalized phaseId is different, also check that cache
  if (phaseId !== normalizedPhaseId) {
    const normalizedCacheKey = generateCacheKey(projectId, normalizedPhaseId, stepId, activityId);
    const normalizedCachedData = getCachedResponse<T>(normalizedCacheKey, responseKey);
    
    if (normalizedCachedData) {
      console.log(`Using cached data for ${activityId} with normalized phase ${normalizedPhaseId}`);
      // Also cache it with the original key for future use
      setCachedResponse(originalCacheKey, normalizedCachedData);
      return normalizedCachedData;
    }
  }
  
  return null;
};

/**
 * Cache response with both original and normalized keys
 */
const cacheResponse = <T>(
  projectId: string,
  phaseId: string,
  normalizedPhaseId: string,
  stepId: string,
  activityId: string,
  response: T
): void => {
  const originalCacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
  setCachedResponse(originalCacheKey, response);
  
  if (phaseId !== normalizedPhaseId) {
    const normalizedCacheKey = generateCacheKey(projectId, normalizedPhaseId, stepId, activityId);
    setCachedResponse(normalizedCacheKey, response);
  }
};

/**
 * Helper function to check if a project is a template
 */
const checkIfTemplateProject = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('is_template')
      .eq('id', projectId)
      .single();
      
    if (error) {
      console.error(`Error checking if project ${projectId} is a template:`, error);
      return false;
    }
    
    return data?.is_template === true;
  } catch (error) {
    console.error(`Error checking if project is a template:`, error);
    return false;
  }
};

/**
 * Fetch activity response data from Supabase
 */
const fetchFromSupabase = async <T>(
  projectId: string,
  phaseId: string,
  stepId: string,
  activityId: string,
  isTemplateProject: boolean = false
): Promise<T | null> => {
  console.log(`FETCH: About to query Supabase for project=${projectId}, phase=${phaseId}, step=${stepId}, activity=${activityId}`);
  
  try {
    // For template projects, use special query with service role to bypass RLS
    if (isTemplateProject) {
      return await fetchTemplateProjectData<T>(projectId, phaseId, stepId, activityId);
    } else {
      return await fetchRegularProjectData<T>(projectId, phaseId, stepId, activityId);
    }
  } catch (error) {
    console.error(`Error in fetchFromSupabase for ${activityId}:`, error);
    return null;
  }
};

/**
 * Fetch data specifically for template projects using RPC
 */
const fetchTemplateProjectData = async <T>(
  projectId: string,
  phaseId: string,
  stepId: string,
  activityId: string
): Promise<T | null> => {
  console.log(`FETCH: Project ${projectId} is a template project, using special fetching logic`);
  
  const { data: rpcData, error: rpcError } = await supabase.rpc('fetch_activity_response', {
    project_id: projectId,
    phase_id: phaseId,
    step_id: stepId,
    activity_id: activityId
  });
  
  if (rpcError) {
    console.error(`Supabase RPC fetch error for phase=${phaseId}, step=${stepId}, activity=${activityId}:`, rpcError);
    return null;
  }
  
  // Check if we got a valid response from the RPC function
  if (!rpcData || typeof rpcData !== 'object') {
    debugSupabaseQuery(`No activity response found for ${phaseId}/${stepId}/${activityId} via RPC`);
    return null;
  }
  
  // Type casting with proper type checking
  const typedResult = rpcData as unknown as FetchActivityResponseResult;
  
  // Handle the result appropriately
  if (!typedResult.found || !typedResult.data) {
    debugSupabaseQuery(`No response content found for ${phaseId}/${stepId}/${activityId} in template project`);
    return null;
  }
  
  const responseData = typedResult.data.ar_response;
  const responseId = typedResult.data.id;
  
  if (!responseData) {
    debugSupabaseQuery(`No response content found for ${phaseId}/${stepId}/${activityId}`);
    return null;
  }
  
  console.log(`FETCH: Got data from Supabase via RPC (ID: ${responseId}):`, responseData);
  
  // Store the complete response in cache for future use
  const cacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
  setCachedResponse(cacheKey, responseData);
  
  return responseData as unknown as T;
};

/**
 * Fetch data for regular projects using standard query
 */
const fetchRegularProjectData = async <T>(
  projectId: string,
  phaseId: string,
  stepId: string,
  activityId: string
): Promise<T | null> => {
  const { data, error } = await supabase
    .from('activity_responses')
    .select('ar_response, id, updated_at')
    .eq('ar_project_id', projectId)
    .eq('ar_phase_id', phaseId)
    .eq('ar_step_id', stepId)
    .eq('ar_activity_id', activityId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();
    
  if (error) {
    console.error(`Supabase fetch error for phase=${phaseId}, step=${stepId}, activity=${activityId}:`, error);
    return null;
  }
  
  // No data from Supabase
  if (!data) {
    debugSupabaseQuery(`No activity response found for ${phaseId}/${stepId}/${activityId}`);
    return null;
  }
  
  const responseData = data.ar_response;
  const responseId = data.id;
  
  if (!responseData) {
    debugSupabaseQuery(`No response content found for ${phaseId}/${stepId}/${activityId}`);
    return null;
  }
  
  console.log(`FETCH: Got data from Supabase (ID: ${responseId}):`, responseData);
  
  // Store the complete response in cache for future use
  const cacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
  setCachedResponse(cacheKey, responseData);
  
  return responseData as unknown as T;
};
