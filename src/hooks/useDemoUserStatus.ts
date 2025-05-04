
import { useEffect, useState } from "react";
import { useUserRole } from "./useUserRole";
import { MAX_DEMO_STORIES } from "@/hooks/collect/form-submission/demoUserLimit";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to manage demo user status and limitations
 * @param projectId Optional project ID to check story count
 * @returns Demo user status and story count information
 */
export const useDemoUserStatus = (projectId?: string | null) => {
  const { isDemo } = useUserRole();
  const [storyCount, setStoryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  
  useEffect(() => {
    if (!isDemo || !projectId) {
      setStoryCount(0);
      setHasReachedLimit(false);
      return;
    }
    
    const fetchStoryCount = async () => {
      setIsLoading(true);
      try {
        const { count, error } = await supabase
          .from('stories')
          .select('*', { count: 'exact', head: true })
          .eq('st_project_id', projectId);

        if (error) {
          console.error("Error counting project stories:", error);
          setStoryCount(0);
        } else {
          const storyTotal = count || 0;
          setStoryCount(storyTotal);
          setHasReachedLimit(storyTotal >= MAX_DEMO_STORIES);
        }
      } catch (error) {
        console.error("Error in fetchStoryCount:", error);
        setStoryCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoryCount();
  }, [isDemo, projectId]);
  
  return {
    isDemo,
    storyCount,
    maxStories: MAX_DEMO_STORIES,
    hasReachedLimit,
    isLoading,
    storiesRemaining: Math.max(0, MAX_DEMO_STORIES - storyCount),
    limitPercentage: Math.min(100, Math.round((storyCount / MAX_DEMO_STORIES) * 100))
  };
};
