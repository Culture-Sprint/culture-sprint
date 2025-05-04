
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface AIPrompt {
  id: string;
  prompt_key: string;
  title: string;
  content: string;
  description: string | null;
  category: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  version: number;
}

/**
 * Service for interacting with AI prompts
 */
export const aiPromptService = {
  /**
   * Fetch all AI prompts
   */
  async getPrompts(): Promise<AIPrompt[]> {
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .order('category, title');
        
      if (error) {
        throw error;
      }
      
      return data as AIPrompt[];
    } catch (error: any) {
      console.error("Error fetching AI prompts:", error);
      return [];
    }
  },
  
  /**
   * Get a prompt by key
   */
  async getPromptByKey(key: string): Promise<AIPrompt | null> {
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .select('*')
        .eq('prompt_key', key)
        .single();
        
      if (error) {
        if (error.code !== 'PGRST116') { // Not found error
          console.error("Error fetching prompt:", error);
        }
        return null;
      }
      
      return data as AIPrompt;
    } catch (error: any) {
      console.error("Error fetching prompt by key:", error);
      return null;
    }
  },
  
  /**
   * Update an existing prompt
   */
  async updatePrompt(prompt: AIPrompt): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_prompts')
        .update({
          title: prompt.title,
          content: prompt.content,
          description: prompt.description
        })
        .eq('id', prompt.id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error updating AI prompt:", error);
      toast({
        title: "Error updating prompt",
        description: error.message || "Failed to update prompt",
        variant: "destructive"
      });
      return false;
    }
  },
  
  /**
   * Create a new prompt
   */
  async createPrompt(prompt: Omit<AIPrompt, 'id' | 'created_at' | 'updated_at' | 'version' | 'created_by'>): Promise<AIPrompt | null> {
    try {
      const { data, error } = await supabase
        .from('ai_prompts')
        .insert({
          prompt_key: prompt.prompt_key,
          title: prompt.title,
          content: prompt.content,
          description: prompt.description,
          category: prompt.category
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      return data as AIPrompt;
    } catch (error: any) {
      console.error("Error creating AI prompt:", error);
      toast({
        title: "Error creating prompt",
        description: error.message || "Failed to create prompt",
        variant: "destructive"
      });
      return null;
    }
  },
  
  /**
   * Delete a prompt by ID
   */
  async deletePrompt(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_prompts')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error("Error deleting AI prompt:", error);
      toast({
        title: "Error deleting prompt",
        description: error.message || "Failed to delete prompt",
        variant: "destructive"
      });
      return false;
    }
  }
};
