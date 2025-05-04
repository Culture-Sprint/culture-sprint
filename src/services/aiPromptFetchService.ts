
import { aiPromptService } from "./aiPromptService";

/**
 * Cache for prompt content to avoid excessive database queries
 */
const promptCache: { [key: string]: { content: string, timestamp: number } } = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Default prompts to use as fallbacks if database fetch fails
 */
const defaultPrompts: { [key: string]: string } = {
  // Story question prompts
  story_question_system: 'You are an AI assistant specialized in helping researchers design effective story questions for narrative inquiry projects. Create questions that will elicit rich, detailed stories relevant to the project\'s focus.',
  story_question_best_practices: 'STORY QUESTION BEST PRACTICES:\n- Story questions should be open-ended and invite personal experiences\n- Questions should be formulated to encourage narrative responses rather than opinions\n- Story questions should avoid leading language that suggests a preferred answer\n- Effective story questions often begin with "Tell me about a time when..." or similar phrases\n- Questions should be specific enough to guide the response but broad enough to allow diverse experiences',
  
  // Slider question prompt
  slider_question_prompt: 'Generate 3 slider questions for a story collection project that explore these important factors from the Define phase: {factors}.\n\nIMPORTANT: The factors identified in the Define phase are particularly important for generating relevant slider questions. Your questions should directly relate to these specific factors to ensure meaningful data collection.\n\nEach question should:\n1. Be directly related to the participant\'s experience with one or more of these specific factors\n2. Use a bipolar scale with clear, concise labels at opposite ends\n3. Be engaging, relevant, and appropriate for the project context\n\nFORMAT YOUR RESPONSE AS VALID JSON OBJECTS with these exact keys:\n- theme (single word describing the concept)\n- question (full sentence asking about their story)\n- leftLabel (3 words max for negative/low end)\n- rightLabel (3 words max for positive/high end)\n\nIMPORTANT: Return ONLY the JSON array with no additional text, explanation, or formatting.',
  
  // General assistant prompt  
  general_assistant_system: 'You are an AI assistant for a participatory narrative inquiry project. Provide thoughtful, concise responses to user queries. Focus on helping the user design their project with clarity and purpose.'
};

/**
 * Service for fetching AI prompts with caching
 */
export const aiPromptFetchService = {
  /**
   * Get prompt content by key with caching
   */
  async getPromptContent(key: string): Promise<string> {
    // Check cache first
    const now = Date.now();
    if (promptCache[key] && now - promptCache[key].timestamp < CACHE_TTL) {
      return promptCache[key].content;
    }
    
    try {
      // Attempt to fetch from database
      const prompt = await aiPromptService.getPromptByKey(key);
      
      if (prompt) {
        // Update cache and return content
        promptCache[key] = {
          content: prompt.content,
          timestamp: now
        };
        return prompt.content;
      }
      
      // Fall back to default if not found
      if (defaultPrompts[key]) {
        return defaultPrompts[key];
      }
      
      console.warn(`Prompt key not found: ${key}`);
      return '';
    } catch (error) {
      console.error(`Error fetching prompt ${key}:`, error);
      
      // Fall back to default if error
      if (defaultPrompts[key]) {
        return defaultPrompts[key];
      }
      
      return '';
    }
  },
  
  /**
   * Clear cache for a specific prompt or all prompts
   */
  clearCache(key?: string) {
    if (key) {
      delete promptCache[key];
    } else {
      for (const k in promptCache) {
        delete promptCache[k];
      }
    }
  }
};
