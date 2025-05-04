
import { useState, useEffect } from "react";
import { isAuthenticated } from "@/services/supabaseSync/operations";

export const useAuthCheck = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = await isAuthenticated();
        console.log("Auth check - User authenticated:", isAuth);
        setIsAuthChecked(true);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthChecked(true); // Still set to true so we proceed
      }
    };
    
    checkAuth();
  }, []);

  return { isAuthChecked };
};
