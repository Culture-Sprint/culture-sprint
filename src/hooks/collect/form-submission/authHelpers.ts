
import { supabase } from "@/integrations/supabase/client";

export const getUserId = async (isPublic: boolean): Promise<string | null> => {
  // For public submissions, we always return null to indicate anonymous user
  if (isPublic) {
    console.log("AUTH HELPER - Public submission mode, using anonymous user ID (null)");
    return null;
  }
  
  // For authenticated submissions, get the current user ID
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("AUTH HELPER ERROR - Error getting user ID:", error);
      return null;
    }
    
    console.log("AUTH HELPER - Authenticated submission, using user ID:", data.user?.id);
    return data.user?.id || null;
  } catch (error) {
    console.error("AUTH HELPER EXCEPTION - Unexpected error getting user ID:", error);
    return null;
  }
};

// Function to determine if the current user is authenticated
export const isUserAuthenticated = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      console.log("AUTH CHECK - No authenticated user found");
      return false;
    }
    
    console.log("AUTH CHECK - Authenticated user found:", data.user.id);
    return true;
  } catch (error) {
    console.error("AUTH CHECK ERROR - Error checking authentication:", error);
    return false;
  }
};
