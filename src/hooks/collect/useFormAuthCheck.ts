
import { useEffect, useState } from "react";
import { isAuthenticated as checkIsAuthenticated } from "@/services/supabaseSync/operations";
import { useAuthCheck } from "./useAuthCheck";

/**
 * Check authentication and handle loading states
 */
export const useFormAuthCheck = (isPublic = false) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { isAuthChecked } = useAuthCheck();

  useEffect(() => {
    // Skip auth check for public forms
    if (isPublic) {
      setIsAuthenticated(false);
      return;
    }

    const checkAuth = async () => {
      if (!isAuthChecked) return;
      
      try {
        // Use the renamed import to avoid the naming conflict
        const authenticated = await checkIsAuthenticated();
        console.log("FormAuth - User authenticated:", authenticated);
        setIsAuthenticated(authenticated);
      } catch (error) {
        console.error("FormAuth - Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, [isPublic, isAuthChecked]);

  return {
    isAuthenticated,
    isAuthChecked: isPublic || isAuthChecked,
    isAuthLoading: !isPublic && !isAuthChecked
  };
};
