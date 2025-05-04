
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to check if a project is a template
 */
export const checkIfTemplateProject = async (projectId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('is_template')
      .eq('id', projectId)
      .single();
      
    if (error) {
      console.error(`Error checking if project ${projectId} is a template:`, error);
      return false;
    }
    
    return data?.is_template === true;
  } catch (error) {
    console.error(`Error checking if project is a template:`, error);
    return false;
  }
};
