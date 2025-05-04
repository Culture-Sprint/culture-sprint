
import { OpenAIMessage, StoryQuestionRequest, ErrorCode } from "../types.ts";
import { formatProjectContext, processOpenAIRequest } from "./handlerUtils.ts";
import { getPromptContent } from "../promptService.ts";

/**
 * Handle story question generation
 */
export async function handleStoryQuestionRequest(requestData: StoryQuestionRequest, requestId: string): Promise<Response> {
  try {
    // Get the system prompt from the database or fall back to default
    const systemPrompt = await getPromptContent('story_question_system', 
      "You are an AI assistant specialized in helping researchers design effective story questions for narrative inquiry projects. Create questions that will elicit rich, detailed stories relevant to the project's focus.");
    
    // Default prompt if none provided
    const userPrompt = requestData.prompt || "Suggest a story question for my project that will elicit rich narratives from participants.";
    
    // Create messages array for the API
    const messages: OpenAIMessage[] = [
      { role: "system", content: systemPrompt }
    ];
    
    // Add design best practices from the database
    const storyQuestionBestPractices = await getPromptContent('story_question_best_practices',
      `STORY QUESTION BEST PRACTICES:
- Story questions should be open-ended and invite personal experiences
- Questions should be formulated to encourage narrative responses rather than opinions
- Story questions should avoid leading language that suggests a preferred answer
- Effective story questions often begin with "Tell me about a time when..." or similar phrases
- Questions should be specific enough to guide the response but broad enough to allow diverse experiences`);
    
    messages.push({
      role: "system",
      content: storyQuestionBestPractices
    });
    
    // Format project context if available
    if (requestData.projectContext) {
      const contextMessage = formatProjectContext(requestData.projectContext, requestId, "PROJECT");
      if (contextMessage) {
        messages.push(contextMessage);
      }
    }
    
    // Add the user's prompt
    messages.push({ role: "user", content: userPrompt });
    
    return await processOpenAIRequest(messages, requestId);
  } catch (error) {
    console.error(`[${requestId}] Error in handleStoryQuestionRequest:`, error);
    throw error;
  }
}
