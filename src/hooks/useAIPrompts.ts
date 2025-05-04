
import { useState, useEffect } from "react";
import { aiPromptService, AIPrompt } from "@/services/aiPromptService";
import { toast } from "@/components/ui/use-toast";

export const useAIPrompts = () => {
  const [prompts, setPrompts] = useState<AIPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const data = await aiPromptService.getPrompts();
      setPrompts(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(prompt => prompt.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      toast({
        title: "Error",
        description: "Failed to load AI prompts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const updatePrompt = async (prompt: AIPrompt) => {
    try {
      const success = await aiPromptService.updatePrompt(prompt);
      
      if (success) {
        toast({
          title: "Success",
          description: "Prompt updated successfully"
        });
        
        // Update in local state
        setPrompts(prevPrompts => 
          prevPrompts.map(p => p.id === prompt.id ? { ...p, ...prompt } : p)
        );
        
        if (selectedPrompt?.id === prompt.id) {
          setSelectedPrompt(prompt);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating prompt:", error);
      return false;
    }
  };
  
  const createPrompt = async (prompt: Omit<AIPrompt, 'id' | 'created_at' | 'updated_at' | 'version' | 'created_by'>) => {
    try {
      const newPrompt = await aiPromptService.createPrompt(prompt);
      
      if (newPrompt) {
        toast({
          title: "Success",
          description: "New prompt created successfully"
        });
        
        // Update local state
        setPrompts(prevPrompts => [...prevPrompts, newPrompt]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating prompt:", error);
      return false;
    }
  };
  
  const deletePrompt = async (id: string) => {
    try {
      const success = await aiPromptService.deletePrompt(id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Prompt deleted successfully"
        });
        
        // Update local state
        setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== id));
        
        if (selectedPrompt?.id === id) {
          setSelectedPrompt(null);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting prompt:", error);
      return false;
    }
  };
  
  useEffect(() => {
    fetchPrompts();
  }, []);
  
  return {
    prompts,
    loading,
    categories,
    selectedPrompt,
    setSelectedPrompt,
    fetchPrompts,
    updatePrompt,
    createPrompt,
    deletePrompt
  };
};
