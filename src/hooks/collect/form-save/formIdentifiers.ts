
import { supabase } from "@/integrations/supabase/client";
import { nanoid } from "nanoid";
import { toast } from "@/components/ui/use-toast";

// Create or update a form identifier for sharing
export const createOrUpdateFormIdentifier = async (projectId: string): Promise<string | null> => {
  try {
    if (!projectId) {
      console.error("No project ID provided for form identifier creation");
      return null;
    }
    
    // Check if a form ID already exists for this project
    const { data: existingFormIds, error: fetchError } = await supabase
      .from('form_identifiers')
      .select('form_id')
      .eq('fi_project_id', projectId)
      .maybeSingle();
      
    if (fetchError && !fetchError.message.includes('No rows found')) {
      console.error("Error checking for existing form ID:", fetchError);
      return null;
    }
    
    // If we found an existing form ID, return it
    if (existingFormIds?.form_id) {
      console.log("Using existing form ID:", existingFormIds.form_id);
      return existingFormIds.form_id;
    }
    
    // Otherwise, create a new form ID
    const formId = nanoid(10); // Generate a short, unique ID
    
    console.log("Creating new form ID:", formId, "for project:", projectId);
    
    const { data, error } = await supabase
      .from('form_identifiers')
      .insert({
        fi_project_id: projectId,
        form_id: formId
      })
      .select('form_id')
      .single();
      
    if (error) {
      console.error("Error creating form identifier:", error);
      return null;
    }
    
    console.log("Created new form ID:", data.form_id);
    return data.form_id;
  } catch (error) {
    console.error("Failed to create/update form identifier:", error);
    return null;
  }
};

// Fetch an existing form identifier for a project
export const fetchExistingFormIdentifier = async (projectId: string): Promise<string | null> => {
  if (!projectId) {
    console.error("No project ID provided for form identifier fetch");
    return null;
  }

  try {
    console.log("Fetching form identifier for project:", projectId);
    
    const { data, error } = await supabase
      .from('form_identifiers')
      .select('form_id')
      .eq('fi_project_id', projectId)
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching form ID:", error);
      return null;
    }
    
    if (!data?.form_id) {
      console.log("No form ID found for project:", projectId);
      return null;
    }
    
    console.log("Found form ID:", data.form_id, "for project:", projectId);
    return data.form_id;
  } catch (error) {
    console.error("Error fetching form ID:", error);
    return null;
  }
};

// Check if a form ID exists
export const checkFormIdExists = async (formId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('form_identifiers')
      .select('form_id')
      .eq('form_id', formId)
      .maybeSingle();
      
    if (error) {
      console.error("Error checking if form ID exists:", error);
      return false;
    }
    
    return !!data?.form_id;
  } catch (error) {
    console.error("Error checking if form ID exists:", error);
    return false;
  }
};

// Revoke a form identifier
export const revokeFormIdentifier = async (projectId: string): Promise<boolean> => {
  try {
    if (!projectId) {
      console.error("No project ID provided for form identifier revocation");
      return false;
    }

    console.log("Revoking form identifier for project:", projectId);
    
    const { error } = await supabase
      .from('form_identifiers')
      .delete()
      .eq('fi_project_id', projectId);

    if (error) {
      console.error("Error revoking form identifier:", error);
      return false;
    }

    console.log("Successfully revoked form identifier for project:", projectId);
    return true;
  } catch (error) {
    console.error("Failed to revoke form identifier:", error);
    return false;
  }
};
