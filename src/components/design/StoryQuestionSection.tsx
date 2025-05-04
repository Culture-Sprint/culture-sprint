
import React, { useState, useEffect } from "react";
import { buildProjectContext } from "@/utils/project-context";
import { useProject } from "@/contexts/ProjectContext";
import { StoryQuestionProvider } from "./story-question/StoryQuestionContext";
import StoryQuestionContent from "./story-question/StoryQuestionContent";

interface StoryQuestionSectionProps {
  projectId?: string;
  projectContext?: string;
}

const StoryQuestionSection: React.FC<StoryQuestionSectionProps> = ({ 
  projectId: propsProjectId,
  projectContext = ''
}) => {
  const { activeProject } = useProject();
  
  // Get the project ID from props or activeProject or localStorage
  const projectId = propsProjectId || 
    (activeProject?.id || localStorage.getItem('activeProjectId') || '');
  
  // If projectContext wasn't provided, build it here - without design context
  const [localProjectContext, setLocalProjectContext] = useState(projectContext);
  
  useEffect(() => {
    const initializeProjectContext = async () => {
      if (!projectContext && activeProject) {
        try {
          // Build project context from active project - NO design context
          const projectContextData = await buildProjectContext(activeProject);
          setLocalProjectContext(projectContextData);
        } catch (error) {
          console.error("Error building project context:", error);
        }
      }
    };
    
    initializeProjectContext();
  }, [projectContext, activeProject]);

  if (!projectId) {
    return <div>No project selected</div>;
  }

  return (
    <StoryQuestionProvider projectId={projectId} projectContext={localProjectContext}>
      <StoryQuestionContent projectContext={localProjectContext} />
    </StoryQuestionProvider>
  );
};

export default StoryQuestionSection;
