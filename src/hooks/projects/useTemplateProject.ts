
import { useState, useEffect, useCallback } from "react";
import { Project } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { toast } from "@/components/ui/use-toast";

/**
 * Hook for handling template projects with Clone-on-View functionality
 */
export const useTemplateProject = () => {
  const [templateProjects, setTemplateProjects] = useState<Project[]>([]);
  const [localClones, setLocalClones] = useState<Record<string, Project>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { isSuperAdmin } = useUserRole();

  // Load template projects from the database
  const fetchTemplateProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("is_template", true);

      if (error) {
        console.error("Error fetching template projects:", error);
        return;
      }

      if (data && data.length > 0) {
        setTemplateProjects(data);
        // Initialize local clones from localStorage if they exist
        const storedClones = localStorage.getItem('template_project_clones');
        if (storedClones) {
          setLocalClones(JSON.parse(storedClones));
        }
      }
    } catch (error) {
      console.error("Unexpected error fetching template projects:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create a template project (superadmins only)
  const createTemplateProject = useCallback(async (name: string, description: string = "") => {
    if (!isSuperAdmin()) {
      toast({
        title: "Permission Denied",
        description: "Only superadmins can create template projects",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to create a template project.",
          variant: "destructive",
        });
        return null;
      }

      console.log("Creating template project with is_template set to TRUE");

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name,
          description,
          user_id: user.id,
          is_template: true
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating template project:", error);
        toast({
          title: "Error creating template project",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Template project created",
        description: `${name} has been created successfully.`,
      });
      
      // Refresh the template projects list
      fetchTemplateProjects();
      
      return data;
    } catch (error: any) {
      console.error("Unexpected error creating template project:", error);
      toast({
        title: "Error",
        description: "Failed to create template project. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  }, [isSuperAdmin, fetchTemplateProjects]);

  // Get a cloned version of a template project (for non-superadmins)
  const getClonedTemplate = useCallback((templateId: string): Project | null => {
    // Find the template project
    const template = templateProjects.find(p => p.id === templateId);
    if (!template) return null;

    // If user is superadmin, return the actual template
    if (isSuperAdmin()) {
      return template;
    }

    // If we already have a clone in memory, return it
    if (localClones[templateId]) {
      return localClones[templateId];
    }

    // Otherwise create a new clone
    const clone: Project = {
      ...template,
      // Add a _clone suffix to indicate this is a local clone
      _clone: true
    };

    // Save to local state and localStorage
    setLocalClones(prev => {
      const updated = { ...prev, [templateId]: clone };
      localStorage.setItem('template_project_clones', JSON.stringify(updated));
      return updated;
    });

    return clone;
  }, [templateProjects, localClones, isSuperAdmin]);

  // Determine if a project is a template or a clone
  const isTemplateOrClone = useCallback((project: Project): boolean => {
    if (!project) return false;
    return project.is_template || !!project._clone;
  }, []);

  // Determine if changes can be saved to this project
  const canSaveChanges = useCallback((project: Project): boolean => {
    if (!project) return false;
    if (!project.is_template) return true; // Regular projects can always be saved
    return isSuperAdmin(); // Only superadmins can save changes to templates
  }, [isSuperAdmin]);

  // Initialize on mount
  useEffect(() => {
    fetchTemplateProjects();
  }, [fetchTemplateProjects]);

  return {
    templateProjects,
    isLoading,
    fetchTemplateProjects,
    createTemplateProject,
    getClonedTemplate,
    isTemplateOrClone,
    canSaveChanges
  };
};
