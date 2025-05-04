
import { useState, useEffect } from "react";
import { Project } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";

export const useProjectOwners = (projects: Project[], isSuperUser: () => boolean) => {
  const [projectOwners, setProjectOwners] = useState<Record<string, string>>({});

  useEffect(() => {
    // If superuser, fetch owner information for all projects
    const fetchProjectOwners = async () => {
      if (!isSuperUser() || projects.length === 0) return;
      
      try {
        // Get unique user IDs from projects
        const userIds = [...new Set(projects.map(p => p.user_id))];
        
        // Fetch profiles for these users
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, username')
          .in('id', userIds);
          
        if (error) {
          console.error('Error fetching project owners:', error);
          return;
        }
        
        // Create a map of user ID to display name
        const ownerMap: Record<string, string> = {};
        
        // Map user IDs to names
        const projectToOwner: Record<string, string> = {};
        
        if (data) {
          // First create a map of user ID to name
          data.forEach(profile => {
            const displayName = profile.full_name || profile.username || 'Unknown User';
            ownerMap[profile.id] = displayName;
          });
          
          // Then map project IDs to owner names
          projects.forEach(project => {
            if (project.user_id && ownerMap[project.user_id]) {
              projectToOwner[project.id] = ownerMap[project.user_id];
            }
          });
        }
        
        setProjectOwners(projectToOwner);
      } catch (err) {
        console.error('Unexpected error fetching project owners:', err);
      }
    };
    
    fetchProjectOwners();
  }, [projects, isSuperUser]);

  return projectOwners;
};
