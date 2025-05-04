
import { useState, useEffect, useCallback } from "react";
import { useActivityResponses } from "@/hooks/useActivityResponses";
import { ActivityFormData } from "@/types/activity";
import { toast } from "@/components/ui/use-toast";
import { useTemplateProject } from "@/hooks/projects/useTemplateProject";
import { clearActivityCache } from "@/services/cache/activityResponseCache";

interface DesignActivity {
  id: string;
  title: string;
  description: string;
}

export const useActivityDataManager = (
  projectId: string | undefined,
  phaseId: string,
  currentStep: string,
  stepActivities: DesignActivity[]
) => {
  const [activityData, setActivityData] = useState<{[key: string]: ActivityFormData}>({});
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [lastSavedActivity, setLastSavedActivity] = useState<string | null>(null);
  const { fetchActivityResponse } = useActivityResponses(projectId || "");
  const { isTemplateOrClone } = useTemplateProject();
  const isTemplateProject = projectId ? isTemplateOrClone({ id: projectId } as any) : false;

  // Listen for storage events (story questions, slider questions, etc.)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('culturesprint_story_question_saved_')) {
        console.log("Story question saved, refreshing data");
        setRefreshCounter(prev => prev + 1);
      }
      if (e.key === 'sliderThemesSaved' && e.newValue === 'true') {
        console.log("Slider questions saved, refreshing data");
        setRefreshCounter(prev => prev + 1);
      }
      if (e.key === 'participantQuestionsSaved' && e.newValue === 'true') {
        console.log("Participant questions saved, refreshing data");
        setRefreshCounter(prev => prev + 1);
      }
    };
    
    // Listen for custom activity_saved events from the window
    const handleActivitySaved = (event: CustomEvent) => {
      if (event.detail) {
        const { phaseId: savedPhaseId, stepId: savedStepId } = event.detail;
        if (savedPhaseId === phaseId && savedStepId === currentStep) {
          console.log("Activity saved event detected, refreshing data");
          setRefreshCounter(prev => prev + 1);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('activity_saved', handleActivitySaved as EventListener);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('activity_saved', handleActivitySaved as EventListener);
    };
  }, [phaseId, currentStep]);

  // Refresh on mount
  useEffect(() => {
    console.log(`DesignPhaseCard mounting for phase: ${phaseId}, refreshing data`);
    setRefreshCounter(prev => prev + 1);
  }, [phaseId]);

  // Load activity data when step changes or refresh is triggered
  useEffect(() => {
    if (!projectId || !currentStep) return;
    
    loadActivityData();
  }, [currentStep, projectId, phaseId, refreshCounter]);
  
  // Load data for a specific activity that was just saved
  useEffect(() => {
    if (lastSavedActivity && projectId) {
      console.log(`Activity ${lastSavedActivity} was just saved, refreshing specifically`);
      loadActivityDataForSingleActivity(lastSavedActivity);
      setLastSavedActivity(null);
    }
  }, [lastSavedActivity, projectId]);

  const loadActivityDataForSingleActivity = useCallback(async (activityId: string) => {
    if (!projectId) return;
    
    try {
      console.log(`Refreshing data for specific activity: ${activityId}`);
      
      // Clear the cache for this specific activity
      clearActivityCache(projectId, phaseId, currentStep, activityId);
      
      // Force refresh for the specific activity
      const response = await fetchActivityResponse(phaseId, currentStep, activityId, true);
      
      if (response) {
        console.log(`Received updated data for ${activityId}:`, response);
        const typedActivityData: ActivityFormData = {};
        
        if (typeof response === 'object' && response !== null) {
          Object.entries(response).forEach(([key, value]) => {
            if (typeof value === 'string') {
              typedActivityData[key] = value;
            }
          });
        }
        
        // Update just this activity in the state
        setActivityData(prev => ({
          ...prev,
          [activityId]: typedActivityData
        }));
      }
    } catch (error) {
      console.error(`Error refreshing data for activity ${activityId}:`, error);
    }
  }, [projectId, phaseId, currentStep, fetchActivityResponse]);

  const loadActivityData = useCallback(async () => {
    if (!projectId || !stepActivities) return;

    let newActivityData = { ...activityData };
    let hasError = false;

    console.log(`Loading activity data for step: ${currentStep}, phase: ${phaseId}, isTemplate: ${isTemplateProject}`);
    
    for (const activity of stepActivities) {
      try {
        console.log(`Fetching activity data for ${activity.id} in phase ${phaseId}`);
        
        // Always force refresh for template projects to get the latest data
        const forceRefresh = isTemplateProject || lastSavedActivity === activity.id;
        
        const response = await fetchActivityResponse(phaseId, currentStep, activity.id, forceRefresh);
        
        if (response) {
          console.log(`Received data for ${activity.id}:`, response);
          const typedActivityData: ActivityFormData = {};
          
          if (typeof response === 'object' && response !== null) {
            Object.entries(response).forEach(([key, value]) => {
              if (typeof value === 'string') {
                typedActivityData[key] = value;
              }
            });
          }
          
          newActivityData[activity.id] = typedActivityData;
        } else {
          console.log(`No data found for ${activity.id} in phase ${phaseId}`);
          if (activity.id in newActivityData) {
            delete newActivityData[activity.id];
          }
        }
      } catch (error) {
        console.error(`Error loading data for activity ${activity.id} in phase ${phaseId}:`, error);
        hasError = true;
      }
    }

    if (hasError) {
      toast({
        title: "Warning",
        description: "Some activity data could not be loaded",
        variant: "destructive",
      });
    }

    console.log("Updated activity data for phase:", phaseId, newActivityData);
    setActivityData(newActivityData);
  }, [projectId, currentStep, phaseId, stepActivities, fetchActivityResponse, isTemplateProject, activityData, lastSavedActivity]);

  const handleActivitySaved = async (activityId: string) => {
    try {
      console.log(`Activity saved: ${activityId}, refreshing data`);
      
      // Mark this activity as recently saved
      setLastSavedActivity(activityId);
      
      // Force immediate refresh
      await loadActivityData();
      
      // Set a timeout to refresh again after a short delay to ensure data is updated
      setTimeout(() => {
        // Clear the cache for this specific activity
        if (projectId) {
          clearActivityCache(projectId, phaseId, currentStep, activityId);
        }
        
        // Trigger another refresh
        setRefreshCounter(prev => prev + 1);
      }, 500);
    } catch (error) {
      console.error(`Error refreshing data for activity ${activityId}:`, error);
    }
  };

  return {
    activityData,
    refreshCounter,
    loadActivityData,
    handleActivitySaved,
    isTemplateProject
  };
};
