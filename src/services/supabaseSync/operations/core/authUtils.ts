
import { supabase } from "@/integrations/supabase/client";

/**
 * Verify authentication status
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return !!data.user;
  } catch (error) {
    console.error("Authentication check error:", error);
    return false;
  }
};
