
/**
 * Entry point for fetching activity responses
 * This module exports the main fetchActivityResponse function
 * and re-exports all related utility functions
 */
export { fetchActivityResponse } from './fetchActivityResponse';
export { 
  fetchFromSupabase,
  directFetchFormAppearance,
  findFormAppearanceInAnyPath
} from './fetchOperations';
export { 
  getCachedActivityResponse,
  cacheActivityResponse
} from './cacheOperations';
export { checkIfTemplateProject } from './projectUtils';

// Helper function to check for RLS policies
export const checkTableRlsPolicies = async () => {
  try {
    const { checkTablePermissions, checkPublicFormAccess } = await import('@/services/supabaseSync/operations/core/rlsUtils');
    console.log("Checking RLS policies for activity_responses table...");
    
    // Use the properly typed function that handles the check safely
    const permissionResult = await checkTablePermissions('activity_responses');
    
    console.log("Permission check result for activity_responses:", permissionResult);
    return permissionResult;
  } catch (err) {
    console.error("Error checking RLS policies:", err);
    return null;
  }
};

// Helper function to handle public form appearance access
export const checkFormAppearanceAccess = async (projectId: string) => {
  try {
    const { checkPublicFormAccess } = await import('@/services/supabaseSync/operations/core/rlsUtils');
    return await checkPublicFormAccess(projectId);
  } catch (err) {
    console.error("Error checking form appearance access:", err);
    return false;
  }
};
