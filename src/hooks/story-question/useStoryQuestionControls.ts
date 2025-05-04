
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { aiAssistantService } from "@/services/aiAssistantService";
import { buildProjectContext } from "@/utils/project-context/contextBuilder";
import { fetchComprehensiveProjectContext } from "@/utils/project-context/dataFetcher";
import { useAIProvider } from "@/contexts/AIProviderContext";

interface StoryQuestionControlsProps {
  projectId: string;
  setResponse: (response: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  projectContext?: string;
}

export const useStoryQuestionControls = ({
  projectId,
  setResponse,
  setIsEditing,
  projectContext = ''
}: StoryQuestionControlsProps) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { provider } = useAIProvider();

  const handleGenerateQuestion = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!projectId) {
      toast({
        title: "Project ID Missing",
        description: "Cannot generate a question without a project ID",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use provided context if available, otherwise fetch and build it
      let context = projectContext;
      
      if (!context) {
        // Fetch comprehensive project context data - NO design context
        const contextData = await fetchComprehensiveProjectContext(projectId);
        
        // Build the project context using the project data object
        const projectContextData = buildProjectContext({ 
          name: `Project ${projectId}`, 
          id: projectId,
          description: "Project context for story question generation",
          activityResponses: contextData
        });
        
        context = projectContextData;
      }
      
      // Call the AI service with the current user's provider preference
      const result = await aiAssistantService.callAssistant({
        prompt: "Suggest a story question that is specific to my project goals and focus",
        projectContext: context,
        mode: 'storyQuestion',
        provider
      });
      
      if (result.error) {
        console.error("Error generating story question:", result.error);
        setError(result.error);
        toast({
          title: "Error",
          description: "Could not generate a story question: " + result.error,
          variant: "destructive",
        });
        return;
      }
      
      if (result.response) {
        // Log the raw response
        console.log("Generated raw question:", result.response);
        
        // Set the response in the parent component
        setResponse(result.response);
        
        // Automatically enter edit mode to allow the user to modify the question
        setIsEditing(true);
        
        // Add a confirmation toast
        toast({
          title: "Question Generated",
          description: `Story question has been generated using ${provider === 'openai' ? 'ChatGPT' : 'Perplexity AI'}`,
        });
      } else {
        setError("No response received from AI assistant");
        toast({
          title: "Error",
          description: "No response received from AI assistant",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error generating story question:", error);
      setError(error.message || "An error occurred");
      toast({
        title: "Error",
        description: error.message || "An error occurred while generating the question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestionClick = () => {
    console.log("Edit question clicked, setting isEditing to true");
    setIsEditing(true);
  };

  return {
    loading,
    error,
    handleGenerateQuestion,
    handleEditQuestionClick
  };
};
