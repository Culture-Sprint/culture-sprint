
// Handles demo user checking and story count logic for throttling

import { supabase } from "@/integrations/supabase/client";

const MAX_DEMO_STORIES = 15;

export const isUserDemo = async (userId?: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    const { data, error } = await supabase.rpc('get_user_roles', {
      user_id: userId
    });

    if (error) {
      console.error("Error checking user roles:", error);
      return false;
    }

    return Array.isArray(data) && data.some(role => role.role_name === 'demo');
  } catch (error) {
    console.error("Error in isUserDemo check:", error);
    return false;
  }
};

export const getProjectStoryCount = async (projectId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .eq('st_project_id', projectId);

    if (error) {
      console.error("Error counting project stories:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Error in getProjectStoryCount:", error);
    return 0;
  }
};

export { MAX_DEMO_STORIES };
