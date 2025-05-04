
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";

export interface DashboardToken {
  id: string;
  project_id: string;
  token: string;
  is_active: boolean;
  created_at: string;
  created_by?: string;
  revoked_at?: string | null;
  expires_at?: string | null;
}

/**
 * Creates a new dashboard sharing token for a project
 */
export const createDashboardToken = async (projectId: string): Promise<DashboardToken | null> => {
  try {
    // Generate a secure, URL-friendly token
    const token = nanoid(16);
    
    const { data, error } = await supabase
      .from('dashboard_tokens')
      .insert({
        project_id: projectId,
        token,
        created_by: (await supabase.auth.getUser()).data.user?.id
      })
      .select('*')
      .single();
    
    if (error) {
      console.error('Error creating dashboard token:', error);
      return null;
    }
    
    return data as DashboardToken;
  } catch (error) {
    console.error('Failed to create dashboard token:', error);
    return null;
  }
};

/**
 * Fetches all active tokens for a project
 */
export const getProjectDashboardTokens = async (projectId: string): Promise<DashboardToken[]> => {
  try {
    const { data, error } = await supabase
      .from('dashboard_tokens')
      .select('*')
      .eq('project_id', projectId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching dashboard tokens:', error);
      return [];
    }
    
    return data as DashboardToken[];
  } catch (error) {
    console.error('Failed to fetch dashboard tokens:', error);
    return [];
  }
};

/**
 * Revokes a dashboard token by setting is_active to false
 */
export const revokeDashboardToken = async (tokenId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('dashboard_tokens')
      .update({
        is_active: false,
        revoked_at: new Date().toISOString()
      })
      .eq('id', tokenId);
    
    if (error) {
      console.error('Error revoking dashboard token:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to revoke dashboard token:', error);
    return false;
  }
};

/**
 * Validates a dashboard token and returns the associated project ID
 */
export const validateDashboardToken = async (token: string): Promise<string | null> => {
  try {
    // Use the database function to validate the token
    const { data, error } = await supabase
      .rpc('validate_dashboard_token', { token_value: token });
    
    if (error || !data) {
      console.error('Error validating dashboard token:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to validate dashboard token:', error);
    return null;
  }
};
