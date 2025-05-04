
import { supabase } from "@/integrations/supabase/client";

/**
 * Check if a project is a template or clone project
 * @param projectId The ID of the project to check
 * @returns Promise resolving to whether the project is a template and whether user can save changes
 */
export const checkProjectTemplateStatus = async (projectId: string | undefined, isSuperAdmin: boolean) => {
  if (!projectId) {
    return { isTemplateProject: false, canSaveChanges: true };
  }

  try {
    const { data: projectData, error } = await supabase
      .from('projects')
      .select('is_template, _clone')
      .eq('id', projectId)
      .single();
    
    if (error) {
      console.error("Error checking project template status:", error);
      return { isTemplateProject: false, canSaveChanges: true };
    }
    
    // Handle the case where projectData might be null
    if (!projectData) {
      console.warn("No project data found for template status check");
      return { isTemplateProject: false, canSaveChanges: true };
    }
    
    // Use type assertion to help TypeScript understand the shape
    const typedData = projectData as { is_template?: boolean, _clone?: boolean };
    
    // Safely check if the project is a template or cloned
    const isTemplateProject = !!typedData.is_template || !!typedData._clone;
    
    // Can save changes if:
    // - Not a template project, OR
    // - Is a template but user is a superadmin
    const canSaveChanges = !isTemplateProject || isSuperAdmin;
    
    return { isTemplateProject, canSaveChanges };
  } catch (error) {
    console.error("Exception in checkProjectTemplateStatus:", error);
    return { isTemplateProject: false, canSaveChanges: true };
  }
};
