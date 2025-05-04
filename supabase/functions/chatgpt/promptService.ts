
import { supabaseAdmin } from "./supabaseAdmin.ts";

// In-memory cache for prompts to avoid excessive database queries
const promptCache: { [key: string]: { content: string, timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get prompt content from database or cache
 */
export async function getPromptContent(key: string, defaultContent: string): Promise<string> {
  try {
    // Check cache first
    const now = Date.now();
    if (promptCache[key] && now - promptCache[key].timestamp < CACHE_TTL) {
      return promptCache[key].content;
    }
    
    // Fetch from database
    const { data, error } = await supabaseAdmin
      .from('ai_prompts')
      .select('content')
      .eq('prompt_key', key)
      .single();
    
    if (error) {
      console.warn(`[promptService] Error fetching prompt ${key}:`, error);
      return defaultContent;
    }
    
    if (data && data.content) {
      // Cache and return the content
      promptCache[key] = {
        content: data.content,
        timestamp: now
      };
      return data.content;
    }
    
    return defaultContent;
  } catch (error) {
    console.error(`[promptService] Unexpected error fetching prompt ${key}:`, error);
    return defaultContent;
  }
}
