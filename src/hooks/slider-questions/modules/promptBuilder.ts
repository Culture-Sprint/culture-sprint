
import { aiPromptFetchService } from '@/services/aiPromptFetchService';

/**
 * Creates AI prompts for slider question generation
 */

/**
 * Creates the AI prompt for generating slider questions
 */
export const createSliderQuestionPrompt = async (factors: string[], projectName: string): Promise<string> => {
  const factorsList = factors.slice(0, 5).join(", ");
  
  try {
    // Get the prompt template from the database
    let promptTemplate = await aiPromptFetchService.getPromptContent('slider_question_prompt');
    
    // Replace the placeholder with actual factors
    return promptTemplate.replace('{factors}', factorsList);
  } catch (error) {
    console.error("Error fetching slider question prompt template:", error);
    
    // Fall back to default template if database fetch fails
    return `Generate 3 slider questions for a story collection project called "${projectName}" that explore these important factors from the Define phase: ${factorsList}.

IMPORTANT: The factors identified in the Define phase are particularly important for generating relevant slider questions. Your questions should directly relate to these specific factors to ensure meaningful data collection.

Each question should:
1. Be directly related to the participant's experience with one or more of these specific factors
2. Use a bipolar scale with clear, concise labels at opposite ends
3. Be engaging, relevant, and appropriate for the project context

FORMAT YOUR RESPONSE AS VALID JSON OBJECTS with these exact keys:
- theme (single word describing the concept)
- question (full sentence asking about their story)
- leftLabel (3 words max for negative/low end)
- rightLabel (3 words max for positive/high end)

IMPORTANT: Return ONLY the JSON array with no additional text, explanation, or formatting.`;
  }
};

/**
 * Builds the complete prompt with context for the AI
 */
export const buildFullPrompt = (context: string, prompt: string): string => {
  return `SYSTEM: You are an AI assistant for a participatory narrative inquiry project.

SYSTEM: IMPORTANT - PROJECT CONTEXT:
${context}

INSTRUCTIONS: Base your response on the project context above. Reference specific elements from the project context when relevant.

USER: ${prompt}`;
};
