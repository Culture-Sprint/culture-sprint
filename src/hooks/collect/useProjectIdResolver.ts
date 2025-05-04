
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to resolve a form ID to a project ID
 * @param isPublic Whether this is for a public form
 * @param formId The form identifier to resolve
 * @returns Object with resolved projectId, loading state, and error
 */
export const useProjectIdResolver = (isPublic: boolean, formId?: string | null) => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const resolveFormId = async () => {
      if (!formId) {
        setLoading(false);
        return;
      }
      
      try {
        console.log("Resolving form ID to project ID:", formId);
        
        // Call the RPC function to get the project ID from the form ID
        const { data, error: fetchError } = await supabase
          .rpc('get_project_id_by_form_id', { p_form_id: formId })
          .maybeSingle();
        
        if (fetchError) {
          console.error("Error resolving form ID:", fetchError);
          setError("Unable to load the form. The link may be invalid or expired.");
        } else if (data) {
          console.log("Resolved project ID:", data);
          setProjectId(data);
        } else {
          console.error("No project ID found for form ID:", formId);
          setError("This form link appears to be invalid or expired.");
        }
      } catch (err) {
        console.error("Error in project ID resolution:", err);
        setError("An unexpected error occurred while loading the form.");
      } finally {
        setLoading(false);
      }
    };
    
    setLoading(true);
    resolveFormId();
  }, [formId]);
  
  return { projectId, loading, error };
};
