
import { useState, useEffect, useCallback } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { ActivityFormData } from "@/types/activity";
import { useActivityResponses } from "@/hooks/activity"; // Use the updated import path
import { toast } from "@/components/ui/use-toast";
import { clearActivityCache } from "@/services/cache/activityResponseCache";

interface UseActivityFormProps {
  phaseId: string;
  stepId: string;
  activityId: string;
  onSaved?: () => void;
}

export const useActivityForm = ({ phaseId, stepId, activityId, onSaved }: UseActivityFormProps) => {
  const { activeProject } = useProject();
  const [formData, setFormData] = useState<ActivityFormData>({});
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [lastProjectId, setLastProjectId] = useState<string | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(true);
  
  // Destructure both loading and saving properties correctly
  const { loading, saving, fetchActivityResponse, saveActivityResponse } = useActivityResponses(activeProject?.id || "");
  
  const loadActivityData = useCallback(async (forceRefresh = false) => {
    if (!activeProject?.id) return;
    
    setIsLoading(true);
    try {
      console.log(`Loading activity data for project ${activeProject.id}, phase ${phaseId}, step ${stepId}, activity ${activityId} with forceRefresh=${forceRefresh}`);
      
      // If forceRefresh is true, clear the activity cache first
      if (forceRefresh && activeProject.id) {
        console.log(`Clearing cache for activity ${activityId}`);
        clearActivityCache(activeProject.id, phaseId, stepId, activityId);
      }
      
      const data = await fetchActivityResponse(phaseId, stepId, activityId, forceRefresh);
      if (data) {
        console.log("Found activity data:", data);
        // Ensure we're setting the correct type for the form data
        const typedData: ActivityFormData = {};
        
        // Convert the response to ensure it matches ActivityFormData type
        if (typeof data === 'object' && data !== null) {
          Object.entries(data).forEach(([key, value]) => {
            if (typeof value === 'string') {
              typedData[key] = value;
            }
          });
        }
        
        setFormData(typedData);
        setIsEditMode(false); // Data exists, so we're in view mode by default
        setSavedSuccessfully(true); // Consider existing data as saved
      } else {
        console.log("No activity data found, using empty object");
        setFormData({});
        setIsEditMode(true); // No data, so we're in edit mode
        setSavedSuccessfully(false);
      }
    } catch (error) {
      console.error("Error loading activity data:", error);
      toast({
        title: "Error",
        description: "Failed to load activity data",
        variant: "destructive",
      });
      setIsEditMode(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeProject?.id, phaseId, stepId, activityId, fetchActivityResponse]);
  
  // Function to force refresh data
  const refreshData = useCallback(() => {
    console.log(`Forcing refresh of data for ${activityId}`);
    loadActivityData(true); // Pass true to force a refresh
  }, [loadActivityData, activityId]);
  
  useEffect(() => {
    if (activeProject?.id) {
      // If project changed, reset form data
      if (lastProjectId && activeProject.id !== lastProjectId) {
        console.log(`Project changed from ${lastProjectId} to ${activeProject.id}, clearing form data`);
        setFormData({});
        setSavedSuccessfully(false);
        setIsEditMode(true);
      }
      setLastProjectId(activeProject.id);
      
      // Load activity data for the current project
      loadActivityData();
    }
  }, [activeProject?.id, loadActivityData, lastProjectId, phaseId, stepId, activityId, refreshTrigger]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} = ${value}`);
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    if (savedSuccessfully) {
      setSavedSuccessfully(false);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeProject?.id) {
      toast({
        title: "Error",
        description: "No active project selected",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Submitting form data:", formData);
    console.log(`Saving to: project=${activeProject.id}, phase=${phaseId}, step=${stepId}, activity=${activityId}`);
    
    try {
      // Save the form data to the backend
      const success = await saveActivityResponse(phaseId, stepId, activityId, formData, null, true);
      
      if (success) {
        console.log("Save was successful");
        
        // Give immediate feedback to the user
        toast({
          title: "Success",
          description: "Your response has been saved",
        });
        
        // Set flag for UI feedback
        setSavedSuccessfully(true);
        setIsEditMode(false);
        
        // Force a reload of the data to ensure we have the latest version
        setTimeout(() => {
          // Clear the cache for this specific activity
          if (activeProject?.id) {
            clearActivityCache(activeProject.id, phaseId, stepId, activityId);
          }
          
          // Reload data with force refresh
          loadActivityData(true);
          
          // Call onSaved callback if provided
          if (onSaved) {
            onSaved();
          }
        }, 300);
      } else {
        console.log("Save was not successful");
        setSavedSuccessfully(false);
        
        toast({
          title: "Save Failed",
          description: "Your response could not be saved. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving form data:", error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive",
      });
    }
  };
  
  const handleEdit = () => {
    setIsEditMode(true);
  };

  return {
    formData,
    isLoading,
    loading,
    saving,
    savedSuccessfully,
    isEditMode,
    handleInputChange,
    handleSubmit,
    handleEdit,
    refreshData,
    activeProject
  };
};
