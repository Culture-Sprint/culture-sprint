
import { useState, useCallback, useRef } from "react";
import { Project } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export const useProjectsFetch = (isSuperUser: () => boolean) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchProjects = useCallback(async () => {
    // Prevent multiple concurrent requests
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user found");
        setProjects([]);
        return;
      }

      // Build the query - always filter by user_id and exclude template projects
      // Templates are handled separately by the useTemplateProject hook
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq('user_id', user.id)
        .eq('is_template', false)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
        toast({
          title: "Error fetching projects",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log("Projects loaded:", data);
      setProjects(data || []);
    } catch (error: any) {
      console.error("Unexpected error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  return {
    projects,
    loading,
    fetchProjects,
    setProjects
  };
};
