
import { useState, useEffect } from "react";
import { FormAppearance, defaultAppearance } from "@/components/design/form-appearance/types";
import { supabase } from "@/integrations/supabase/client";
import { isPlainObject } from "@/services/publicForm/types";
import { toast } from "@/components/ui/use-toast";

interface UseFormAppearanceLoaderReturn {
  appearance: FormAppearance;
  isLoading: boolean;
  error: string | null;
  hasBlobUrl: boolean;
  debugInfo?: any;
  reloadAppearance: () => Promise<void>;
}

export const useFormAppearanceLoader = (
  projectId: string | null | undefined,
  debug: boolean = false
): UseFormAppearanceLoaderReturn => {
  const [appearance, setAppearance] = useState<FormAppearance>(defaultAppearance);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasBlobUrl, setHasBlobUrl] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const loadFormAppearance = async () => {
    if (!projectId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      if (debug) console.log(`Loading form appearance for project ID: ${projectId}`);
      
      let localDebugData: any = debug ? {
        query: {
          projectId,
          searchPaths: ['build/form-appearance/form-appearance-editor'],
          timestamp: new Date().toISOString(),
        }
      } : null;
      
      // Only query the build phase
      const { data, error: buildError } = await supabase
        .from('activity_responses')
        .select('ar_response, updated_at')
        .eq('ar_project_id', projectId)
        .eq('ar_phase_id', 'build')
        .eq('ar_step_id', 'form-appearance')
        .eq('ar_activity_id', 'form-appearance-editor')
        .maybeSingle();
        
      if (buildError && !data) {
        console.error("Error fetching form appearance:", buildError);
        setError(`Failed to load form appearance: ${buildError.message}`);
        setAppearance(defaultAppearance);
        
        if (debug && localDebugData) {
          localDebugData.error = buildError;
          setDebugInfo(localDebugData);
        }
        return;
      }
      
      if (data?.ar_response && isPlainObject(data.ar_response)) {
        const response = data.ar_response as Record<string, any>;
        if (debug) console.log("Form appearance data loaded:", response);
        
        // Check if the logoUrl is a blob URL
        const hasBlobUrl = typeof response.logoUrl === 'string' && response.logoUrl.startsWith('blob:');
        setHasBlobUrl(hasBlobUrl);
        
        // Use empty string if it's a blob URL since it won't work across sessions
        const logoUrl = typeof response.logoUrl === 'string' && !hasBlobUrl 
          ? response.logoUrl 
          : ''; 
        
        // Create a valid form appearance object with type checks
        const formAppearance: FormAppearance = {
          backgroundColor: typeof response.backgroundColor === 'string' && response.backgroundColor
            ? response.backgroundColor 
            : defaultAppearance.backgroundColor,
          logoUrl: logoUrl,
          headerText: typeof response.headerText === 'string' && response.headerText
            ? response.headerText 
            : defaultAppearance.headerText,
          subheaderText: typeof response.subheaderText === 'string' && response.subheaderText
            ? response.subheaderText 
            : defaultAppearance.subheaderText
        };
        
        setAppearance(formAppearance);
        
        if (debug && localDebugData) {
          localDebugData.query.foundAt = 'build/form-appearance/form-appearance-editor';
          localDebugData.response = response;
          localDebugData.blobUrlDetection = {
            hasBlobUrls: hasBlobUrl,
            blobUrl: hasBlobUrl ? response.logoUrl : null
          };
          setDebugInfo(localDebugData);
        }
      } else {
        if (debug) console.log("No form appearance data found, using defaults");
        setAppearance(defaultAppearance);
        
        if (debug && localDebugData) {
          localDebugData.notFound = true;
          setDebugInfo(localDebugData);
        }
      }
    } catch (err) {
      console.error("Error in form appearance loader:", err);
      setError(err instanceof Error ? err.message : "Unknown error loading form appearance");
      setAppearance(defaultAppearance);
      
      if (debug) {
        const errorDebugData = {
          error: err,
          timestamp: new Date().toISOString()
        };
        setDebugInfo(errorDebugData);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFormAppearance();
  }, [projectId, debug]);

  const reloadAppearance = async () => {
    await loadFormAppearance();
  };

  return { appearance, isLoading, error, hasBlobUrl, debugInfo, reloadAppearance };
};
