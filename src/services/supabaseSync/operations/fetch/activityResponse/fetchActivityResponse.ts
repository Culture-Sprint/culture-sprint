
import { debugSupabaseQuery } from "../../core/debugUtils";
import { normalizePhaseId } from "@/components/design/utils/formFieldUtils";
import { getCachedActivityResponse } from "./cacheOperations";
import { checkIfTemplateProject } from "./projectUtils";
import { fetchFromSupabase, directFetchFormAppearance, findFormAppearanceInAnyPath } from "./fetchOperations";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch activity response from Supabase with caching and error handling
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
  console.log(`[Activity Response] Fetching from project=${projectId}, phase=${phaseId}, step=${stepId}, activity=${activityId}`);
  try {
    const { data: authData } = await supabase.auth.getUser();
    const isAuthenticated = !!authData?.user?.id;
    console.log(`[Activity Response] User authentication status: ${isAuthenticated}`);
    
    // Normalize the phase ID to handle both old and new naming
    const normalizedPhaseId = normalizePhaseId(phaseId);
    
    // Check cache first if not forcing refresh
    const cachedResult = await getCachedActivityResponse<T>(
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
    
    console.log(`FETCH DIAGNOSIS: Looking for ${phaseId}/${stepId}/${activityId} (project: ${projectId})`);
    
    // Special handling for form appearance editor
    if (activityId === 'form-appearance-editor') {
      console.log(`FETCH DIAGNOSIS: This is a form appearance request, trying direct lookup first`);
      
      // Try direct query to the exact path where the data is known to be
      const exactPathResult = await directFetchFormAppearance(projectId);
      
      if (exactPathResult) {
        console.log(`FETCH DIAGNOSIS: Found form appearance via direct path query!`);
        // Return directly without additional type assertion
        return exactPathResult as T;
      } else {
        console.log(`FETCH DIAGNOSIS: Direct path query returned no results`);
      }
    }
    
    // Standard fetch process
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
    }
    
    // Special handling for form appearance data - try alternate paths
    if (!result && activityId === 'form-appearance-editor') {
      // Try common alternative phase IDs for form appearance data
      const additionalPhases = ['collect', 'design', 'form-appearance', 'build'];
      
      for (const phase of additionalPhases) {
        if (phase !== phaseId && phase !== normalizedPhaseId && !result) {
          console.log(`FETCH: Trying additional phase ${phase} for form appearance`);
          result = await fetchFromSupabase<T>(
            projectId, 
            phase, 
            stepId, 
            activityId, 
            isTemplateProject
          );
          
          if (result) {
            console.log(`FETCH: Found with ${phase} phase`);
            break;
          }
        }
      }
      
      // Final fallback: try to find any form appearance data
      if (!result) {
        console.log(`FETCH: Trying last resort - any path for form appearance`);
        
        const fallbackResult = await findFormAppearanceInAnyPath(projectId);
        
        if (fallbackResult) {
          // Simple direct assignment for type compatibility
          return fallbackResult as T;
        }
      }
    }
    
    if (result) {
      // Extract specific key if requested
      if (responseKey && typeof result === 'object' && result !== null && responseKey in (result as object)) {
        return (result as any)[responseKey] as T;
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
