
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProject } from "@/contexts/ProjectContext";
import { parseCSVFile, convertCSVToStories, isCSVFile } from "@/utils/story/csvImportUtils";
import { saveStory } from "@/hooks/collect/form-submission/storyOperations";
import { saveSliderResponses } from "@/hooks/collect/form-submission/sliderResponseOperations";
import { saveParticipantData } from "@/hooks/collect/form-submission/participantResponseOperations";
import { StoryData } from "@/hooks/collect/form-submission/types";
import { supabase } from "@/integrations/supabase/client";

interface ImportResults {
  successCount: number;
  errorCount: number;
  hasRLSError: boolean;
  demoLimitReached?: boolean;
  availableSlots?: number;
}

export const useStoryImport = (onImportSuccess: () => void) => {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const { activeProject } = useProject();

  const validateProject = (): boolean => {
    if (!activeProject?.id) {
      toast({
        title: "No active project",
        description: "Please select a project before importing stories.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  
  const validateFileType = (file: File): boolean => {
    if (!isCSVFile(file)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const importFile = async (file: File): Promise<void> => {
    if (!activeProject?.id || !validateFileType(file)) return;
    
    setIsImporting(true);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting current user:", userError);
        throw new Error("Could not authenticate user");
      }
      
      const userId = userData.user?.id;
      
      let isDemoUser = false;
      let currentStoryCount = 0;
      
      if (userId) {
        const { data: roles, error: rolesError } = await supabase.rpc('get_user_roles', {
          user_id: userId
        });
        
        if (!rolesError) {
          isDemoUser = Array.isArray(roles) && roles.some(role => role.role_name === 'demo');
          
          if (isDemoUser) {
            const { count, error: countError } = await supabase
              .from('stories')
              .select('*', { count: 'exact', head: true })
              .eq('st_project_id', activeProject.id);
              
            if (!countError) {
              currentStoryCount = count || 0;
            }
          }
        }
      }
      
      const csvData = await parseCSVFile(file);
      const storiesToImport = convertCSVToStories(csvData);
      
      if (isDemoUser) {
        const availableSlots = Math.max(0, 15 - currentStoryCount);
        
        if (availableSlots <= 0) {
          toast({
            title: "Demo Account Limit Reached",
            description: "You've reached the maximum of 15 stories for demo accounts. Please contact us to upgrade your account.",
            variant: "destructive"
          });
          setIsImporting(false);
          return;
        }
        
        if (storiesToImport.length > availableSlots) {
          toast({
            title: "Import Limit Warning",
            description: `As a demo user, you can only import ${availableSlots} more stories. Only the first ${availableSlots} stories will be imported.`,
            variant: "default",
            duration: 6000
          });
          
          storiesToImport.splice(availableSlots);
        }
      }
      
      const importResults = await importStories(storiesToImport, activeProject.id, userId);
      handleImportResults(importResults);
      
    } catch (error) {
      console.error("Error parsing CSV:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to parse CSV file.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const importStories = async (storiesToImport: any[], projectId: string, userId?: string): Promise<ImportResults> => {
    let successCount = 0;
    let errorCount = 0;
    let hasRLSError = false;
    let demoLimitReached = false;
    
    for (const story of storiesToImport) {
      try {
        const formData: StoryData = {
          title: story.title,
          text: story.text,
          emotionalResponse: story.feeling || "",
          additionalComments: story.additional_comments || "",
          sliderResponses: [],
          participantResponses: [],
          projectId: projectId,
          isImported: true
        };
        
        const storyId = await saveStory(formData, projectId, userId);
        
        if (storyId === "demo-limit-reached") {
          demoLimitReached = true;
          break;
        }
        
        if (storyId && storyId !== "demo-limit-reached") {
          if (story.sliderResponses && story.sliderResponses.length > 0) {
            await saveSliderData(story, storyId, projectId);
          }
          
          if (story.participantResponses && story.participantResponses.length > 0) {
            await saveParticipantData(createParticipantFormData(story, projectId), storyId);
          }
          
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error("Error importing story:", error);
        errorCount++;
        
        if (error && typeof error === 'object' && 'code' in error && error.code === '42501') {
          hasRLSError = true;
        }
      }
    }
    
    return { successCount, errorCount, hasRLSError, demoLimitReached };
  };

  const saveSliderData = async (story: any, storyId: string, projectId: string) => {
    const sliderFormData: StoryData = {
      text: story.text,
      title: story.title,
      emotionalResponse: "",
      additionalComments: "",
      sliderResponses: story.sliderResponses.map((slider: any) => ({
        questionId: slider.question_id,
        questionText: slider.question_text || `Slider Question ${slider.question_id}`,
        value: slider.value !== null ? slider.value : 0
      })),
      participantResponses: [],
      projectId: projectId
    };
    
    await saveSliderResponses(sliderFormData, storyId);
  };

  const createParticipantFormData = (story: any, projectId: string): StoryData => {
    const participantFormData: StoryData = {
      text: story.text,
      title: story.title,
      emotionalResponse: "",
      additionalComments: "",
      sliderResponses: [],
      participantResponses: story.participantResponses.map((response: any) => ({
        questionId: response.question_id,
        questionText: response.question_text,
        choiceId: response.response,
        choiceText: response.response
      })),
      projectId: projectId
    };
    
    return participantFormData;
  };

  const handleImportResults = ({ successCount, errorCount, hasRLSError, demoLimitReached }: ImportResults) => {
    if (demoLimitReached) {
      toast({
        title: "Demo Account Limit Reached",
        description: `Successfully imported ${successCount} stories. You've reached the maximum of 15 stories for demo accounts.`,
        variant: "default",
        duration: 6000
      });
      
      if (successCount > 0) {
        onImportSuccess();
      }
      return;
    }
    
    if (successCount > 0) {
      toast({
        title: "Import completed",
        description: `Successfully imported ${successCount} stories with their responses. ${errorCount > 0 ? `Failed to import ${errorCount} stories.` : ''}`,
        variant: "default"
      });
      
      onImportSuccess();
    } else {
      if (hasRLSError) {
        toast({
          title: "Import failed - Permission denied",
          description: "You don't have permission to add stories to this project. Please contact your project administrator.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Import failed",
          description: `Failed to import any stories. Please check your CSV format and try again.`,
          variant: "destructive"
        });
      }
    }
  };

  return {
    isImporting,
    validateProject,
    importFile
  };
};
