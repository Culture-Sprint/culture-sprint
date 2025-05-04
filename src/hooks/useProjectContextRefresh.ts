
/**
 * Hook for refreshing project context data
 */
import { useState } from "react";
import { clearProjectContext } from "@/utils/project-context/clearProjectContext";
import { useProject } from "@/contexts/ProjectContext";
import { toast } from "@/components/ui/use-toast";

export const useProjectContextRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { activeProject } = useProject();
  
  const refreshProjectContext = async () => {
    if (!activeProject?.id) {
      toast({
        title: "No active project",
        description: "Please select a project first",
        variant: "destructive"
      });
      return;
    }
    
    setIsRefreshing(true);
    
    try {
      // Show initial toast
      toast({
        title: "Refreshing project context",
        description: "Clearing all cached data and preparing for fresh fetch...",
      });
      
      // Clear all design phase related cache items
      localStorage.removeItem(`culturesprint_story_question_saved_${activeProject.id}`);
      localStorage.removeItem(`culturesprint_story_question_${activeProject.id}`);
      localStorage.removeItem(`sliderThemesSaved_${activeProject.id}`);
      localStorage.removeItem(`culturesprint_slider_themes_${activeProject.id}`);
      localStorage.removeItem(`participantQuestionsSaved_${activeProject.id}`);
      localStorage.removeItem(`culturesprint_participant_questions_${activeProject.id}`);
      
      // Set a flag to force context refresh
      sessionStorage.setItem(`refresh_context_${activeProject.id}`, 'true');
      
      // Clear all context-related caches
      await clearProjectContext(activeProject.id);
      
      // Also clear any related localStorage items for this project
      Object.keys(localStorage).forEach(key => {
        if (key.includes(activeProject.id) && (
            key.includes('context') || 
            key.includes('activity') || 
            key.includes('response') ||
            key.includes('story_question') ||
            key.includes('slider') ||
            key.includes('participant')
          )) {
          localStorage.removeItem(key);
        }
      });
      
      // Reset all state trackers for the hooks
      localStorage.removeItem('story_question_last_project_id');
      localStorage.removeItem('slider_question_last_project_id');
      localStorage.removeItem('participant_question_last_project_id');
      
      // Success notification
      toast({
        title: "Project context fully refreshed",
        description: "All cached data has been cleared. The page will reload to fetch fresh data.",
        duration: 5000,
      });
      
      // Force page reload to ensure all components use fresh data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error refreshing project context:", error);
      toast({
        title: "Refresh failed",
        description: "Could not refresh project context. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return {
    refreshProjectContext,
    isRefreshing
  };
};
