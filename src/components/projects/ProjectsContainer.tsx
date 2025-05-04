
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Project } from "@/types/project";
import { useProjects } from "@/hooks/useProjects";
import { useUserRole } from "@/hooks/useUserRole";
import ProjectFormDialog from "./ProjectFormDialog";
import ProjectsHeader from "./ProjectsHeader";
import ProjectsContent from "./ProjectsContent";

const ProjectsContainer = () => {
  const { user } = useAuth();
  const { isSuperUser, isSuperAdmin } = useUserRole();
  const { 
    projects, 
    loading, 
    fetchProjects, 
    createProject, 
    updateProject, 
    deleteProject, 
    navigateToProject,
    projectOwners,
    isTemplateOrClone,
    createTemplateProject
  } = useProjects();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isTemplateDialog, setIsTemplateDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user, fetchProjects]);

  const handleCreateProject = async (name: string, description: string) => {
    // Check if we're creating a template or regular project
    if (isTemplateDialog) {
      // Use the template project creation
      console.log("Creating a template project");
      const newProject = await createTemplateProject(name, description);
      if (newProject) {
        setIsCreateDialogOpen(false);
        navigateToProject(newProject);
      }
    } else {
      // Use the standard project creation
      console.log("Creating a regular project");
      const newProject = await createProject(name, description);
      if (newProject) {
        setIsCreateDialogOpen(false);
        navigateToProject(newProject);
      }
    }
  };

  const handleEditProject = async (name: string, description: string) => {
    if (currentProject) {
      const success = await updateProject(currentProject.id, name, description);
      if (success) {
        setIsEditDialogOpen(false);
        setCurrentProject(null);
      }
    }
  };

  const openProjectForEditing = (project: Project) => {
    setCurrentProject(project);
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <ProjectsHeader 
        isSuperUser={isSuperUser()} 
        isSuperAdmin={isSuperAdmin()}
        onCreateClick={() => {
          setIsTemplateDialog(false);
          setIsCreateDialogOpen(true);
        }}
        onCreateTemplateClick={() => {
          setIsTemplateDialog(true);
          setIsCreateDialogOpen(true);
        }}
      />

      <ProjectsContent
        projects={projects}
        loading={loading}
        onCreateClick={() => {
          setIsTemplateDialog(false);
          setIsCreateDialogOpen(true);
        }}
        onOpenProject={navigateToProject}
        onEditProject={openProjectForEditing}
        onDeleteProject={deleteProject}
        projectOwners={projectOwners}
        isTemplateOrClone={isTemplateOrClone}
      />

      {/* Create Project Dialog */}
      <ProjectFormDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateProject}
        mode="create"
        isTemplate={isTemplateDialog}
      />

      {/* Edit Project Dialog */}
      <ProjectFormDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditProject}
        project={currentProject}
        mode="edit"
        isTemplate={currentProject?.is_template}
      />
    </>
  );
};

export default ProjectsContainer;
