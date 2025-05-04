
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import StoryQuestionSection from "./StoryQuestionSection";
import GeneralPromptSection from "./GeneralPromptSection";
import { useProject } from "@/contexts/ProjectContext";
import { useDesignAssistant } from "@/hooks/useDesignAssistant";
import { getDesignContext } from "@/utils/design-context";
import { buildProjectContext } from "@/utils/project-context/contextBuilder";
import { AssistantMode } from "@/types/chatTypes";

interface DesignAssistantProps {
  mode?: AssistantMode;
  projectContext?: string;
}

const DesignAssistant: React.FC<DesignAssistantProps> = ({ 
  mode = 'general',
  projectContext = ''
}) => {
  const { activeProject } = useProject();
  const projectId = activeProject?.id || '';
  
  // Story Question mode is always expanded, general mode is collapsible
  const [isOpen, setIsOpen] = useState(mode === 'storyQuestion' ? true : false);
  
  // Get the appropriate design context based on mode
  const designContext = getDesignContext();
  
  // State for the project context
  const [localProjectContext, setLocalProjectContext] = useState('');
  
  // State for the combined context (for general mode only)
  const [combinedContext, setCombinedContext] = useState('');
  
  // Prepare the project context
  useEffect(() => {
    const prepareContext = async () => {
      // If project context is already provided, use it
      if (projectContext) {
        setLocalProjectContext(projectContext);
        setCombinedContext(`${projectContext}\n\n${designContext}`);
        return;
      }
      
      // Otherwise build it from the active project
      if (activeProject) {
        try {
          const builtContext = await buildProjectContext({
            name: activeProject.name,
            description: activeProject.description || '',
            id: activeProject.id
          });
          
          setLocalProjectContext(builtContext);
          setCombinedContext(`${builtContext}\n\n${designContext}`);
        } catch (error) {
          console.error("Error building project context:", error);
          setCombinedContext(designContext); // Fallback to just design context
        }
      } else {
        setCombinedContext(designContext);
      }
    };
    
    prepareContext();
  }, [projectContext, designContext, activeProject]);
  
  // When mode changes, update isOpen state
  useEffect(() => {
    if (mode === 'storyQuestion') {
      setIsOpen(true);
    }
  }, [mode]);
  
  // For general mode, use the design assistant hook
  const {
    prompt,
    setPrompt,
    messages,
    loading,
    handleSubmit,
    clearChat
  } = useDesignAssistant({
    mode,
    projectContext: combinedContext // Use the combined context for general mode
  });
  
  return (
    <Card className="col-span-1 lg:col-span-3 shadow-md border border-[#7A0266] border-opacity-30 mb-8">
      <Collapsible open={isOpen} onOpenChange={mode === 'storyQuestion' ? undefined : setIsOpen}>
        <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100">
          {mode === 'storyQuestion' ? (
            <>
              <div className="flex items-center gap-2">
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5 text-primary opacity-80" />
                  Story Questions
                </CardTitle>
              </div>
              <CardDescription>
                Define the question that will elicit stories from participants
              </CardDescription>
            </>
          ) : (
            <CollapsibleTrigger className="w-full flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Search className="h-5 w-5 text-primary opacity-80" />
                    Design Assistant
                  </CardTitle>
                </div>
                <CardDescription>
                  Use AI to help design your story collection project
                </CardDescription>
              </div>
              {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </CollapsibleTrigger>
          )}
        </CardHeader>
        
        <CollapsibleContent {...(mode === 'storyQuestion' ? { forceMount: true } : {})}>
          <CardContent className="space-y-4 pt-4 bg-gradient-to-b from-white to-culturesprint-50/20 rounded-b-md">
            {mode === 'storyQuestion' ? (
              <StoryQuestionSection 
                projectId={projectId}
                projectContext={localProjectContext} // Pass ONLY project context
              />
            ) : (
              <GeneralPromptSection 
                prompt={prompt}
                setPrompt={setPrompt}
                messages={messages}
                loading={loading}
                onSubmit={handleSubmit}
                onClearChat={clearChat}
                projectContext={combinedContext} // Pass combined context
              />
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DesignAssistant;
