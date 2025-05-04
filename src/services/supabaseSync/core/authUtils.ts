
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if the current user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};
