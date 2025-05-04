
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { Project } from "@/types/project";
import { useUserRole } from "./useUserRole";
import { useProjectsFetch } from "./projects/useProjectsFetch";
import { useProjectOperations } from "./projects/useProjectOperations";
import { useProjectOwners } from "./projects/useProjectOwners";
import { useTemplateProject } from "./projects/useTemplateProject";
import { toast } from "@/components/ui/use-toast";

export const useProjects = () => {
  const { setActiveProject } = useProject();
  const navigate = useNavigate();
  const { isSuperUser, isSuperAdmin } = useUserRole();
  
  const { 
    projects: userProjects, 
    loading: userProjectsLoading, 
    fetchProjects 
  } = useProjectsFetch(isSuperUser);
  
  const {
    templateProjects,
    isLoading: templateProjectsLoading,
    fetchTemplateProjects,
    getClonedTemplate,
    isTemplateOrClone,
    canSaveChanges,
    createTemplateProject
  } = useTemplateProject();
  
  // Memoize the combined projects array to prevent unnecessary rerenders
  const allProjects = useCallback(() => {
    return [...userProjects, ...templateProjects];
  }, [userProjects, templateProjects]);
  
  const loading = userProjectsLoading || templateProjectsLoading;
  
  const projectOwners = useProjectOwners(allProjects(), isSuperUser);
  
  const { 
    createProject, 
    updateProject, 
    deleteProject 
  } = useProjectOperations(fetchProjects);

  const navigateToProject = useCallback((project: Project) => {
    // If this is a template project and user is not a superadmin,
    // get the cloned version first
    if (project.is_template && !isSuperAdmin()) {
      const clone = getClonedTemplate(project.id);
      if (clone) {
        setActiveProject(clone);
        navigate("/design");
        return;
      }
    }
    
    setActiveProject(project);
    navigate("/design");
  }, [getClonedTemplate, isSuperAdmin, navigate, setActiveProject]);

  // Override the update function to handle template projects
  const handleUpdateProject = async (projectId: string, name: string, description: string = "") => {
    const project = allProjects().find(p => p.id === projectId);
    
    if (!project) {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if this is a template project
    if (project.is_template) {
      // If user is not a superadmin, cannot edit template
      if (!isSuperAdmin()) {
        toast({
          title: "Permission Denied",
          description: "You cannot modify template projects",
          variant: "destructive",
        });
        return false;
      }
      
      // Allow superadmin to update the template
      const success = await updateProject(projectId, name, description);
      if (success) {
        // Refresh template projects
        fetchTemplateProjects();
      }
      return success;
    }
    
    // Regular project, handle normally
    return updateProject(projectId, name, description);
  };

  // Override the delete function to handle template projects
  const handleDeleteProject = async (projectId: string) => {
    const project = allProjects().find(p => p.id === projectId);
    
    if (!project) {
      toast({
        title: "Error",
        description: "Project not found",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if this is a template project
    if (project.is_template) {
      // If user is not a superadmin, cannot delete template
      if (!isSuperAdmin()) {
        toast({
          title: "Permission Denied",
          description: "You cannot delete template projects",
          variant: "destructive",
        });
        return false;
      }
    }
    
    // Allow deletion (with appropriate permissions)
    return deleteProject(projectId);
  };

  // Create a stable combined fetch function
  const fetchAllProjects = useCallback(async () => {
    await Promise.all([fetchProjects(), fetchTemplateProjects()]);
  }, [fetchProjects, fetchTemplateProjects]);

  return {
    projects: allProjects(),
    loading,
    fetchProjects: fetchAllProjects,
    createProject,
    createTemplateProject,
    updateProject: handleUpdateProject,
    deleteProject: handleDeleteProject,
    navigateToProject,
    projectOwners,
    isTemplateOrClone,
    canSaveChanges
  };
};
