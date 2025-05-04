
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks the RLS policies for a specific table using raw SQL query
 * This is useful for debugging permission issues
 */
export const checkTableRlsPolicies = async (tableName: string) => {
  try {
    console.log(`Checking RLS policies for ${tableName} table...`);
    
    // Use raw query functionality instead of typed query builder
    const { data, error } = await supabase
      .from(tableName as any) // Use type assertion to bypass type checking
      .select('id')
      .limit(1);
    
    if (error) {
      console.error(`Error fetching RLS policies for ${tableName}:`, error);
      return null;
    }
    
    console.log(`RLS policies or access test for ${tableName}:`, data);
    return data;
  } catch (err) {
    console.error(`Error checking RLS policies for ${tableName}:`, err);
    return null;
  }
};

/**
 * Checks if the current user has permissions to access a table
 * Returns a detailed permission report
 */
export const checkTablePermissions = async (tableName: string) => {
  try {
    console.log(`Checking permissions for ${tableName}...`);
    
    // Try a simple SELECT to check read permissions
    const { data: readData, error: readError } = await supabase
      .from(tableName as any) // Use type assertion to bypass type checking
      .select('id')
      .limit(1);
      
    const readPermission = {
      allowed: !readError,
      error: readError ? readError.message : null
    };
    
    // Get auth status
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const authStatus = {
      isAuthenticated: !!userData?.user,
      userId: userData?.user?.id || null,
      error: userError ? userError.message : null
    };
    
    // Check if this is public form access
    const isPublicFormAccess = !authStatus.isAuthenticated && tableName === 'activity_responses';
    
    return {
      tableName,
      permissions: {
        read: readPermission
      },
      auth: authStatus,
      isPublicFormAccess,
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    console.error(`Error checking permissions for ${tableName}:`, err);
    return {
      tableName,
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Checks if a project has a valid public form ID
 * This is used to verify that unauthenticated access is allowed
 */
export const checkPublicFormAccess = async (projectId: string) => {
  try {
    if (!projectId) return false;
    
    const { data, error } = await supabase
      .rpc('has_public_form_id', { project_id: projectId });
      
    if (error) {
      console.error("Error checking public form access:", error);
      return false;
    }
    
    return !!data;
  } catch (err) {
    console.error("Error in public form access check:", err);
    return false;
  }
};
