
import { useState, useEffect } from "react";
import { fetchActivityResponse as fetchActivityResponseFromSupabase } from "@/services/supabaseSync/operations";
import { handleError } from "@/utils/errorHandling";
import { useErrorHandler } from "@/utils/errorHandling";
import { useActivityResponsesSave } from "@/hooks/activity/useActivityResponsesSave";

/**
 * Hook for fetching and saving activity responses
 */
export const useActivityResponses = (projectId: string) => {
  const { wrapHandler } = useErrorHandler("ActivityResponses");
  const { saveActivityResponse } = useActivityResponsesSave(projectId);
  
  /**
   * Fetches an activity response from Supabase
   */
  const fetchActivityResponse = wrapHandler(async (
    phaseId: string,
    stepId: string,
    activityId: string,
    forceRefresh: boolean = false
  ) => {
    console.log(`[ActivityResponses] Fetching activity data for ${activityId} with forceRefresh=${forceRefresh}`);
    
    if (!projectId) {
      console.error(`[ActivityResponses] Project ID is required to fetch activity data`);
      return null;
    }
    
    console.log(`[SupabaseDebug] [${projectId}] Fetching from ${phaseId}/${stepId}/${activityId}`);
    
    try {
      const response = await fetchActivityResponseFromSupabase(
        projectId,
        phaseId,
        stepId,
        activityId,
        null,
        null,
        forceRefresh
      );
      
      if (response) {
        console.log(`[ActivityResponses] Fetched activity response for ${activityId}:`, 
          typeof response === 'object' 
            ? JSON.stringify(response).substring(0, 100) + "..." 
            : response);
      } else {
        console.log(`[ActivityResponses] No data found for ${activityId}`);
      }
      
      return response;
    } catch (error) {
      handleError(error, `Error fetching activity response for ${activityId}`, {
        showToast: false,
        context: { projectId, phaseId, stepId, activityId }
      });
      return null;
    }
  });
  
  return {
    fetchActivityResponse,
    saveActivityResponse
  };
};
