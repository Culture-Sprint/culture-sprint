
import { useState, useEffect, useCallback, useRef } from "react";
import { Story } from "@/types/story";
import { useToast } from "@/hooks/toast";
import { useProject } from "@/contexts/ProjectContext";
import { fetchStoriesForProject } from "@/services/story/fetch/fetchStoriesForProject";

/**
 * A hook that provides access to stories for the active project
 * @returns An object containing stories array and loading state
 */
export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { activeProject } = useProject();
  const autoRefreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);
  
  const loadStories = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    // Clear any previous errors when loading
    setError(null);
    console.log("STORIES HOOK - Loading stories for project:", activeProject?.id);
    
    try {
      if (!activeProject?.id) {
        console.log("STORIES HOOK - No active project, showing empty stories list");
        setStories([]);
        setIsLoading(false);
        return;
      }
      
      // Force clear cache when refetching
      sessionStorage.removeItem(`stories_cache_${activeProject.id}`);
      
      const fetchedStories = await fetchStoriesForProject(activeProject.id);
      console.log("STORIES HOOK - Successfully loaded stories:", fetchedStories.length);
      setStories(fetchedStories);
    } catch (err) {
      console.error("STORIES HOOK - Error loading stories:", err);
      // Set the error state so components can handle it
      setError(err instanceof Error ? err : new Error(String(err)));
      
      toast({
        title: "Error loading stories",
        description: "There was a problem loading the stories. Please try again.",
        variant: "destructive"
      });
      
      setStories([]);
    } finally {
      setIsLoading(false);
      isInitialLoadRef.current = false;
    }
  }, [toast, activeProject?.id]);
  
  useEffect(() => {
    // Clear any existing timer when component remounts or project changes
    if (autoRefreshTimerRef.current) {
      clearInterval(autoRefreshTimerRef.current);
    }
    
    // Perform initial load
    loadStories();
    
    // Set up a regular polling for story updates, but don't show loading state for auto-refresh
    autoRefreshTimerRef.current = setInterval(() => {
      console.log("STORIES HOOK - Auto-refreshing stories");
      // Don't show loading indicator for background refreshes
      loadStories(false).catch(err => {
        console.error("STORIES HOOK - Error during auto-refresh:", err);
        // Don't set error state for background refreshes to avoid disrupting the UI
      });
    }, 30000); // Poll every 30 seconds
    
    return () => {
      if (autoRefreshTimerRef.current) {
        clearInterval(autoRefreshTimerRef.current);
        autoRefreshTimerRef.current = null;
      }
    };
  }, [loadStories]);
  
  const refetch = useCallback(async () => {
    console.log("STORIES HOOK - Attempting to refetch stories");
    try {
      // Force a hard refresh to ensure we get fresh data
      await loadStories(true);
      console.log("STORIES HOOK - Successfully refetched stories");
      return true;
    } catch (err) {
      console.error("STORIES HOOK - Error refetching stories:", err);
      // Set the error state
      setError(err instanceof Error ? err : new Error(String(err)));
      
      toast({
        title: "Refresh failed",
        description: "Could not refresh the stories list. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [loadStories, toast]);

  return { stories, isLoading, refetch, error };
};

export default useStories;
