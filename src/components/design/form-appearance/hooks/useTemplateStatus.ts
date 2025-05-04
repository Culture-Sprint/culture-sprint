
import { useState, useEffect } from "react";
import { checkProjectTemplateStatus } from "@/utils/demoUserUtils";

/**
 * Hook to check if a project is a template and if user can save changes
 */
export const useTemplateStatus = (projectId?: string, isSuperAdmin: boolean = false) => {
  const [canSaveChanges, setCanSaveChanges] = useState(true);
  const [isTemplateProject, setIsTemplateProject] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    
    const checkStatus = async () => {
      setIsChecking(true);
      try {
        const { isTemplateProject: isTemplate, canSaveChanges: canSave } = 
          await checkProjectTemplateStatus(projectId, isSuperAdmin);
        
        setIsTemplateProject(isTemplate);
        setCanSaveChanges(canSave);
      } catch (error) {
        console.error("Error checking template status:", error);
        // Default to allowing changes if check fails
        setCanSaveChanges(true);
        setIsTemplateProject(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkStatus();
  }, [projectId, isSuperAdmin]);

  return { canSaveChanges, isTemplateProject, isChecking };
};
