
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Project } from "@/types/project";
import { ProjectOperations } from "./types";

export const useProjectOperations = (
  fetchProjects: () => Promise<void>
): ProjectOperations => {
  const createProject = async (name: string, description: string = "") => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a project.",
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name,
          description,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating project:", error);
        toast({
          title: "Error creating project",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Project created",
        description: `${name} has been created successfully.`,
      });

      // Refresh the projects list
      fetchProjects();
      
      return data;
    } catch (error: any) {
      console.error("Unexpected error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateProject = async (projectId: string, name: string, description: string = "") => {
    try {
      const { error } = await supabase
        .from("projects")
        .update({
          name,
          description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) {
        console.error("Error updating project:", error);
        toast({
          title: "Error updating project",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Project updated",
        description: `${name} has been updated successfully.`,
      });

      // Refresh the projects list
      fetchProjects();
      
      return true;
    } catch (error: any) {
      console.error("Unexpected error updating project:", error);
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", projectId);

      if (error) {
        console.error("Error deleting project:", error);
        toast({
          title: "Error deleting project",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });

      // Refresh the projects list
      fetchProjects();
      
      return true;
    } catch (error: any) {
      console.error("Unexpected error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    createProject,
    updateProject,
    deleteProject,
    navigateToProject: () => {} // This will be implemented in the main hook
  };
};
