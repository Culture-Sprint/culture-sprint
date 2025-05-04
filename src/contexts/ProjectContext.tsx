
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '@/types/project';
import { clearFormDataCache } from '@/services/cache/formDataCache';
import { clearActivityCache } from '@/services/supabaseSync/operations/cache/responseCache';
import { clearProjectContext } from '@/utils/project-context/clearProjectContext';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { removeCachedItem } from '@/services/cache/cacheService';
import { PROJECT_CACHE_KEYS } from '@/services/cache/projectCache';

interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  refreshTemplateProject: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const { isSuperAdmin } = useUserRole();

  useEffect(() => {
    const savedProject = localStorage.getItem('activeProject');
    if (savedProject) {
      try {
        const parsedProject = JSON.parse(savedProject);
        setActiveProject(parsedProject);
      } catch (error) {
        console.error('Failed to parse saved project', error);
        localStorage.removeItem('activeProject');
      }
    }
  }, []);

  useEffect(() => {
    if (activeProject) {
      // Don't save template clone to localStorage to avoid polluting it
      if (!activeProject._clone) {
        localStorage.setItem('activeProject', JSON.stringify(activeProject));
      }
      
      const previousProjectId = localStorage.getItem('last_active_project_id');
      
      if (previousProjectId && previousProjectId !== activeProject.id) {
        console.log(`Project changed from ${previousProjectId} to ${activeProject.id}, clearing all project caches`);
        
        // Update the last active project ID
        localStorage.setItem('last_active_project_id', activeProject.id);
        
        try {
          // Clear the complete project context for the previous project
          if (previousProjectId) {
            console.log(`Clearing complete context for previous project: ${previousProjectId}`);
            clearProjectContext(previousProjectId);
            
            // Also remove completion indicators for previous project
            localStorage.removeItem(`sliderThemesSaved_${previousProjectId}`);
            localStorage.removeItem(`participantQuestionsSaved_${previousProjectId}`);
            localStorage.removeItem(`culturesprint_story_question_saved_${previousProjectId}`);
            
            // Clear last loaded project ID cache to prevent showing previous project data
            removeCachedItem('last_loaded_project_id', { storage: 'session' });
          }
          
          // Also clear caches for the current project to ensure fresh data
          clearProjectContext(activeProject.id);
          
          // Remove completion indicators for the current project to force a fresh check
          localStorage.removeItem(`sliderThemesSaved_${activeProject.id}`);
          localStorage.removeItem(`participantQuestionsSaved_${activeProject.id}`);
          localStorage.removeItem(`culturesprint_story_question_saved_${activeProject.id}`);
          
          // Set a flag to force any components to refresh their data
          sessionStorage.setItem(`refresh_context_${activeProject.id}`, 'true');
          
          console.log("Successfully cleared all caches for project switch");
        } catch (error) {
          console.error('Failed to clear caches for project switch', error);
        }
      } else if (!previousProjectId) {
        localStorage.setItem('last_active_project_id', activeProject.id);
      }
    } else {
      localStorage.removeItem('activeProject');
    }
  }, [activeProject]);

  // Function to refresh template project from the database (for superadmins)
  const refreshTemplateProject = async () => {
    if (!activeProject?.is_template || !isSuperAdmin()) return;
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', activeProject.id)
        .single();
        
      if (error) {
        console.error('Error refreshing template project:', error);
        return;
      }
      
      if (data) {
        setActiveProject(data);
      }
    } catch (error) {
      console.error('Failed to refresh template project:', error);
    }
  };

  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject, refreshTemplateProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
