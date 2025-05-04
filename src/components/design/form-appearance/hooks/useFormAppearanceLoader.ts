
import { useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";
import { FormAppearance, validateAppearanceData } from "../types";
import { fetchActivityResponse } from "@/services/supabaseSync/operations/fetch/fetchActivityResponse";
import { debugSupabaseQuery } from "@/services/supabaseSync/operations/core/debugUtils";
import { FetchActivityResponseResult } from "@/services/supabaseSync/types/responseTypes";

/**
 * Hook to handle loading form appearance data with caching
 */
export const useFormAppearanceLoader = (projectId?: string, useBuildPhaseOnly: boolean = true) => {
  const [appearance, setAppearance] = useState<FormAppearance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBlobUrl, setHasBlobUrl] = useState(false);
  const isEditing = useRef(false);

  const reloadAppearance = async () => {
    if (!projectId) {
      setError("No project ID provided");
      setIsLoading(false);
      return;
    }

    // Don't reload if we're currently editing to prevent losing changes
    if (isEditing.current) {
      return;
    }

    try {
      setIsLoading(true);
      debugSupabaseQuery(`Loading form appearance for project: ${projectId} (build phase only: ${useBuildPhaseOnly})`);
      
      // IMPORTANT: Always load from the build phase for form appearance
      // First fetch the response as unknown type, then cast it to the expected type
      const responseData = await fetchActivityResponse(
        projectId, 
        'build', 
        'form-appearance', 
        'form-appearance-editor', 
        null as unknown as FetchActivityResponseResult,
        null,
        true
      );
      
      // Safely cast the response to the expected type after fetch
      const response = responseData as unknown as FetchActivityResponseResult;
      
      // Check that response contains the expected structure
      if (response && response.found === true && response.data && response.data.ar_response) {
        debugSupabaseQuery(`Loaded form appearance data: ${JSON.stringify(response.data.ar_response)}`);
        
        // Check if logo URL is a blob URL that won't work across sessions
        const logoUrl = response.data.ar_response?.logoUrl || '';
        const blobDetected = typeof logoUrl === 'string' && logoUrl.startsWith('blob:');
        setHasBlobUrl(blobDetected);
        
        // Validate and sanitize the response data
        const validAppearance = validateAppearanceData(response.data.ar_response);
        setAppearance(validAppearance);
        setError(null);
      } else {
        debugSupabaseQuery("No form appearance data found");
        setAppearance(null);
      }
    } catch (err) {
      console.error("Error loading form appearance:", err);
      setError(err instanceof Error ? err.message : "Unknown error loading form appearance");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    reloadAppearance();
  }, [projectId, useBuildPhaseOnly]);

  return { 
    appearance, 
    isLoading, 
    error, 
    hasBlobUrl,
    reloadAppearance,
    setAppearance,
    isEditing
  };
};
