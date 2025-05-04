
import { useState } from "react";
import { useErrorHandler } from "@/utils/errorHandling";
import { saveActivityResponse as saveActivityResponseToSupabase } from "@/services/supabaseSync/operations";

/**
 * Hook for saving activity responses
 */
export const useActivityResponsesSave = (projectId: string) => {
  const { wrapHandler } = useErrorHandler("ActivityResponsesSave");
  const [saving, setSaving] = useState(false);
  
  /**
   * Saves an activity response to Supabase
   */
  const saveActivityResponse = wrapHandler(async <T>(
    phaseId: string,
    stepId: string,
    activityId: string,
    data: T,
    responseKey: string | null = null
  ): Promise<boolean> => {
    console.log(`[ActivityResponsesSave] Saving activity data for ${activityId}`);
    
    if (!projectId) {
      console.error(`[ActivityResponsesSave] Project ID is required to save activity data`);
      return false;
    }
    
    try {
      setSaving(true);
      const success = await saveActivityResponseToSupabase(
        projectId,
        phaseId,
        stepId,
        activityId,
        data,
        responseKey
      );
      
      return success;
    } catch (error) {
      console.error(`[ActivityResponsesSave] Error saving activity response for ${activityId}:`, error);
      return false;
    } finally {
      setSaving(false);
    }
  });
  
  return {
    saveActivityResponse,
    saving
  };
};
