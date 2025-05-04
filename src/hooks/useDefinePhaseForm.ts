
import { useState, useEffect } from "react";
import { useActivityResponses } from "@/hooks/useActivityResponses"; // Import the hook with both fetch and save methods
import { toast } from "@/components/ui/use-toast";
import { DesignStep } from "@/data/designPhases";

interface FormData {
  [activityId: string]: {
    [fieldId: string]: string;
  };
}

export const useDefinePhaseForm = (projectId: string, phaseId: string, stepId: string, currentStep?: DesignStep) => {
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { fetchActivityResponse, saveActivityResponse } = useActivityResponses(projectId);
  
  useEffect(() => {
    if (!projectId || !currentStep) return;
    
    const loadActivitiesData = async () => {
      setIsLoading(true);
      try {
        const newFormData: FormData = {};
        
        // Load data for each activity
        for (const activity of currentStep.activities) {
          const response = await fetchActivityResponse(phaseId, stepId, activity.id);
          if (response) {
            // Ensure the response is properly typed as a record of field IDs to string values
            const typedResponse: { [fieldId: string]: string } = {};
            
            // Convert the response to the expected format
            if (typeof response === 'object' && response !== null) {
              Object.entries(response).forEach(([key, value]) => {
                if (typeof value === 'string') {
                  typedResponse[key] = value;
                }
              });
            }
            
            newFormData[activity.id] = typedResponse;
          } else {
            newFormData[activity.id] = {};
          }
        }
        
        setFormData(newFormData);
      } catch (error) {
        console.error("Error loading activity data:", error);
        toast({
          title: "Error",
          description: "Failed to load activity data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadActivitiesData();
  }, [projectId, stepId, currentStep, fetchActivityResponse, phaseId]);
  
  const handleInputChange = (activityId: string, fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [activityId]: {
        ...prev[activityId],
        [fieldId]: value
      }
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !currentStep) return;
    
    setIsSaving(true);
    try {
      // Save each activity's data
      for (const activity of currentStep.activities) {
        const activityData = formData[activity.id] || {};
        await saveActivityResponse(phaseId, stepId, activity.id, activityData);
      }
      
      toast({
        title: "Success",
        description: "Your responses have been saved",
        variant: "default",
      });
    } catch (error) {
      console.error("Error saving activity data:", error);
      toast({
        title: "Error",
        description: "Failed to save activity data",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return {
    formData,
    isLoading,
    isSaving,
    handleInputChange,
    handleSubmit
  };
};
