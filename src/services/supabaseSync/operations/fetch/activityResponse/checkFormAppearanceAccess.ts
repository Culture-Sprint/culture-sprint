
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the form appearance data is accessible to public users
 * @param projectId The project ID to check
 * @returns Promise resolving to true if public access is allowed
 */
export const checkFormAppearanceAccess = async (projectId: string): Promise<boolean> => {
  try {
    // First, check if there's a valid form identifier for this project
    const { data: formIdentifierData, error: formIdentifierError } = await supabase
      .rpc('has_public_form_id', { project_id: projectId });
      
    if (formIdentifierError) {
      console.error("Error checking if project has public form ID:", formIdentifierError);
      return false;
    }
    
    // If the project has a public form ID, it should be accessible
    return !!formIdentifierData;
  } catch (error) {
    console.error("Error checking form appearance access:", error);
    return false;
  }
};
