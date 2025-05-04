
import { useState, useCallback, useRef, useEffect } from "react";
import { FormAppearance, defaultAppearance } from "../types";
import { useActivityResponses } from "@/hooks/useActivityResponses";
import { useAppearanceLoader } from "./useAppearanceLoader";
import { useAppearanceSaver } from "./useAppearanceSaver";
import { validateAppearanceData } from "../utils/appearanceValidation";
import { supabase } from "@/integrations/supabase/client";
import { isAuthenticated } from "@/services/supabaseSync/core/authUtils";

export const useFormAppearance = (projectId?: string) => {
  // Always initialize with default appearance to ensure UI always has data to display
  const [appearance, setAppearance] = useState<FormAppearance>({ ...defaultAppearance });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<boolean | null>(null);
  
  // Track if we're currently editing to prevent data reloads while editing
  const isEditing = useRef(false);
  // Track if initial load has been attempted
  const initialLoadAttempted = useRef(false);
  
  const { fetchActivityResponse, saveActivityResponse } = useActivityResponses(projectId || "");
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      setAuthStatus(isAuth);
      console.log("Form Appearance - Auth Status:", isAuth);
    };
    
    checkAuth();
  }, []);
  
  // Add direct Supabase check for debugging
  useEffect(() => {
    if (projectId) {
      const checkFormAppearanceDirectly = async () => {
        console.log("FORM APPEARANCE DEBUG: Checking directly in Supabase for project:", projectId);
        
        try {
          // First verify auth status
          const { data: userData, error: userError } = await supabase.auth.getUser();
          console.log("Form Appearance - User authenticated:", !!userData.user);
          
          // Always check in the build phase for consistency
          const { data, error } = await supabase
            .from('activity_responses')
            .select('ar_phase_id, ar_step_id, ar_activity_id, ar_response')
            .eq('ar_project_id', projectId)
            .eq('ar_phase_id', 'build')
            .eq('ar_step_id', 'form-appearance')
            .eq('ar_activity_id', 'form-appearance-editor')
            .maybeSingle();
            
          if (error) {
            console.error("Direct check error:", error);
            if (error.message.includes("permission denied") || error.code === "42501") {
              console.error("PERMISSIONS ERROR: This suggests RLS policies are blocking access");
            }
          } else if (data) {
            console.log("FORM APPEARANCE DEBUG: Found data directly:", data);
            console.log("FORM APPEARANCE CONTENT:", data.ar_response);
          } else {
            console.log("FORM APPEARANCE DEBUG: No data found in direct check");
            
            // Try a more generic query
            const { data: allData, error: allError } = await supabase
              .from('activity_responses')
              .select('ar_phase_id, ar_step_id, ar_activity_id')
              .eq('ar_project_id', projectId)
              .limit(5);
              
            if (allError) {
              console.error("Error on generic query:", allError);
            } else {
              console.log("Generic query results:", allData);
            }
          }
        } catch (err) {
          console.error("Error in direct check:", err);
        }
      };
      
      checkFormAppearanceDirectly();
    }
  }, [projectId]);
  
  const { loadAppearance } = useAppearanceLoader({
    projectId,
    setAppearance,
    setIsLoading,
    setError,
    isEditing,
    fetchActivityResponse,
    validateAppearanceData
  });
  
  const { saveAppearance: save } = useAppearanceSaver({
    projectId,
    setIsSaving,
    appearance,
    saveActivityResponse,
    isEditing
  });

  // Trigger data loading only once when project ID changes
  useEffect(() => {
    if (projectId && !initialLoadAttempted.current) {
      console.log("Initial load of form appearance for project:", projectId);
      setIsLoading(true);
      initialLoadAttempted.current = true;
      
      loadAppearance(true).catch((error) => {  // Force refresh on initial load
        console.error("Error during initial load:", error);
        setIsLoading(false);
      });
    }
  }, [projectId, loadAppearance]);

  // Create a version of setAppearance that marks we're editing
  const updateAppearance = useCallback((newValue: Partial<FormAppearance>) => {
    // Mark that we're currently editing to prevent reloads
    isEditing.current = true;
    
    setAppearance(prev => ({
      ...prev,
      ...newValue
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    isEditing.current = true;
    console.log("Resetting to defaults");
    setAppearance({ ...defaultAppearance });
  }, []);

  // Add a safety timeout to prevent infinite loading state
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        console.log("Safety timeout: Setting isLoading to false after timeout");
        setIsLoading(false);
      }, 3000); 
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  // Modified version that accepts an appearance parameter
  const saveAppearance = async (appearanceToSave?: FormAppearance) => {
    // Use the provided appearance or the current state
    const dataToSave = appearanceToSave || appearance;
    
    // Always save to the build phase
    const success = await save(dataToSave);
    
    if (success) {
      // Reset the editing flag
      isEditing.current = false;
      
      // CRITICAL: Force reload appearance from the server to ensure UI is in sync
      // This is important when on the /design route
      setTimeout(() => {
        console.log("Forcing reload of appearance after save");
        loadAppearance(true); // true = force refresh
      }, 500);
    }
    
    return success;
  };

  return {
    appearance,
    setAppearance: updateAppearance,
    saveAppearance,
    isSaving,
    isLoading,
    error,
    loadAppearance,
    resetToDefaults,
    authStatus
  };
};
