
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { aiAssistantService } from "@/services/aiAssistantService";
import { createStoryDataContext } from "@/components/dashboard/pattern-insights/PatternContext";
import { extractJsonFromAIResponse } from "./JsonProcessor";
import { ThemeCluster } from "./types";
import { generateThemeColors } from "./utils";
import { Story } from "@/types/story";

export const useThemeAnalysis = (stories: Story[]) => {
  const [themeClusters, setThemeClusters] = useState<ThemeCluster[]>([]);
  const [isThemeAnalysisLoading, setIsThemeAnalysisLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<Error | null>(null);
  const { toast } = useToast();

  const analyzeThemes = async () => {
    if (stories.length === 0) {
      const error = new Error("No stories available for analysis");
      setAnalysisError(error);
      return { error };
    }
    
    // Reset state
    setAnalysisError(null);
    setIsThemeAnalysisLoading(true);
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (isThemeAnalysisLoading) {
        setIsThemeAnalysisLoading(false);
        const timeoutError = new Error("Theme analysis timed out. Please try again.");
        setAnalysisError(timeoutError);
        toast({
          title: "Analysis Timeout",
          description: "Theme analysis took too long. Please try again.",
          variant: "destructive"
        });
      }
    }, 30000); // 30 second timeout
    
    try {
      const projectName = "Story Analysis";
      const context = createStoryDataContext({ stories, projectName });
      
      const prompt = `Group these stories into 4-6 themes. Assign each story to ONE theme.
      
      Return a JSON array in this exact format with no additional text:
      [
        {"theme": "Theme name", "storyIds": [1, 2, 3]}
      ]`;
      
      console.log("Sending AI assistant request...");
      const result = await aiAssistantService.callAssistant({
        prompt,
        projectContext: context,
        mode: 'general'
      });
      
      if (result.error || !result.response) {
        clearTimeout(timeout);
        const error = new Error(result.error || "Failed to get AI response");
        setAnalysisError(error);
        setIsThemeAnalysisLoading(false);
        return { error };
      }
      
      const responseText = result.response;
      setLastResponse(responseText);
      
      console.log("AI Response received:", responseText.substring(0, 100) + "...");
      
      const jsonData = extractJsonFromAIResponse(responseText);
      
      if (!jsonData) {
        clearTimeout(timeout);
        const error = new Error("Could not extract valid JSON from AI response");
        console.error("Failed to extract JSON from response:", responseText);
        setAnalysisError(error);
        setIsThemeAnalysisLoading(false);
        return { error };
      }
      
      if (!Array.isArray(jsonData)) {
        clearTimeout(timeout);
        const error = new Error("Extracted data is not an array");
        console.error("Extracted data is not an array:", jsonData);
        setAnalysisError(error);
        setIsThemeAnalysisLoading(false);
        return { error };
      }
      
      if (jsonData.length === 0) {
        clearTimeout(timeout);
        const error = new Error("Theme analysis produced no results");
        console.error("Extracted array is empty");
        setAnalysisError(error);
        setIsThemeAnalysisLoading(false);
        return { error };
      }
      
      const firstItem = jsonData[0];
      if (!firstItem.theme || !Array.isArray(firstItem.storyIds)) {
        clearTimeout(timeout);
        const error = new Error("Theme data doesn't match expected format");
        console.error("Invalid JSON structure:", firstItem);
        setAnalysisError(error);
        setIsThemeAnalysisLoading(false);
        return { error };
      }
      
      const colors = generateThemeColors(jsonData.length);
      const newThemeClusters = jsonData.map((item: any, index: number) => {
        // Ensure numeric storyIds for comparison
        const numericStoryIds = item.storyIds.map((id: any) => 
          typeof id === 'string' ? parseInt(id, 10) : id
        );
        
        return {
          theme: item.theme,
          stories: stories.filter(story => {
            const storyId = typeof story.id === 'string' ? parseInt(story.id, 10) : story.id;
            return numericStoryIds.includes(storyId);
          }),
          color: colors[index]
        };
      });
      
      console.log("Theme clusters created:", newThemeClusters.map(c => ({
        theme: c.theme,
        storiesCount: c.stories.length,
        color: c.color
      })));
      
      setThemeClusters(newThemeClusters);
      clearTimeout(timeout);
      setIsThemeAnalysisLoading(false);
      
      return { themeClusters: newThemeClusters };
    } catch (error) {
      clearTimeout(timeout);
      console.error("Error analyzing themes:", error);
      
      const errorObj = error instanceof Error ? error : new Error("Unknown error during theme analysis");
      setAnalysisError(errorObj);
      
      setIsThemeAnalysisLoading(false);
      return { error: errorObj };
    }
  };

  return {
    themeClusters,
    isThemeAnalysisLoading,
    analyzeThemes,
    analysisError
  };
};
