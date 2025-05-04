
import { supabase } from "@/integrations/supabase/client";
import { debugSupabaseQuery } from "../../core/debugUtils";
import { cacheActivityResponse } from "./cacheOperations";

/**
 * Fetch form appearance data directly from known path
 */
export const directFetchFormAppearance = async (projectId: string): Promise<any> => {
  try {
    console.log(`DIRECT FETCH: Attempting to fetch form appearance for project ${projectId} from build/form-appearance/form-appearance-editor`);
    
    // Explicitly query the exact path where we know the data exists
    const { data, error } = await supabase
      .from('activity_responses')
      .select('ar_response')
      .eq('ar_project_id', projectId)
      .eq('ar_phase_id', 'build')
      .eq('ar_step_id', 'form-appearance')
      .eq('ar_activity_id', 'form-appearance-editor')
      .maybeSingle();
    
    if (error) {
      console.error(`DIRECT FETCH ERROR: ${error.message}`, error);
      return null;
    }
    
    if (data?.ar_response) {
      console.log(`DIRECT FETCH SUCCESS: Found form appearance data`, data.ar_response);
      return data.ar_response;
    } else {
      console.log(`DIRECT FETCH: No form appearance data found in exact path`);
      return null;
    }
  } catch (err) {
    console.error(`Error in direct form appearance fetch:`, err);
    return null;
  }
};

/**
 * Fetch activity response data from Supabase
 */
export const fetchFromSupabase = async <T>(
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
export const fetchTemplateProjectData = async <T>(
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
  const typedResult = rpcData as { found: boolean, data?: { ar_response: any, id: string } };
  
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
  
  return responseData as unknown as T;
};

/**
 * Fetch data for regular projects using standard query
 */
export const fetchRegularProjectData = async <T>(
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
  
  // Store the response in cache for both original and normalized phase IDs
  cacheActivityResponse(projectId, phaseId, phaseId, stepId, activityId, responseData);
  
  return responseData as unknown as T;
};

/**
 * Find form appearance data in any path
 */
export const findFormAppearanceInAnyPath = async (projectId: string): Promise<any> => {
  console.log(`FETCH: Trying to find form appearance data in any path`);
  
  try {
    const { data, error } = await supabase
      .from('activity_responses')
      .select('ar_response, ar_phase_id, ar_step_id')
      .eq('ar_project_id', projectId)
      .eq('ar_activity_id', 'form-appearance-editor')
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    if (!error && data?.ar_response) {
      console.log(`FETCH: Found form appearance data in general query from path: ${data.ar_phase_id}/${data.ar_step_id}/form-appearance-editor`);
      return data.ar_response;
    }
    
    return null;
  } catch (err) {
    console.error(`Error in fallback form appearance query:`, err);
    return null;
  }
};
