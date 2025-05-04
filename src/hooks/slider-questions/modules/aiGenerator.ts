
import { prepareProjectContext } from '../modules/contextPreparation';
import { chatGptService } from '@/services/chatGptService';
import { SliderQuestion } from '@/services/types/designTypes';
import { Project } from '@/types/project';
import { createSliderQuestionPrompt } from './promptBuilder';
import { updateDebugInfoField } from './debugInfo';

/**
 * Generates slider questions using AI based on factors
 */
export const generateWithAI = async (
  factors: string[], 
  activeProject: Project | null
): Promise<SliderQuestion[] | null> => {
  if (!factors || factors.length === 0) {
    console.error("No factors provided for slider question generation");
    return null;
  }

  if (!activeProject || !activeProject.id) {
    console.error("No active project provided for context building");
    return null;
  }

  try {
    console.log("Generating slider questions for factors:", factors);
    
    // Get comprehensive project context including all phases
    const contextData = await prepareProjectContext(activeProject, "Generating slider questions");
    
    if (!contextData || !contextData.context) {
      console.error("Failed to prepare project context");
      updateDebugInfoField('context', "ERROR: Failed to build project context");
      return null;
    }
    
    // Store the context in debug info
    updateDebugInfoField('context', contextData.context);
    
    // Create the prompt for the AI - now properly awaited since it's async
    const prompt = await createSliderQuestionPrompt(factors, activeProject.name);
    updateDebugInfoField('prompt', prompt);
    
    // Call the AI service with the prompt and context
    const result = await chatGptService.callChatGpt({
      prompt,
      projectContext: contextData.context
    });
    
    if (!result.response) {
      console.error("No response received from AI:", result.error);
      updateDebugInfoField('response', `ERROR: ${result.error}`);
      return null;
    }
    
    // Store the raw response
    updateDebugInfoField('response', result.response);
    
    // Try to parse the response as JSON
    let parsedQuestions: SliderQuestion[];
    
    try {
      // Trim any non-JSON content from the beginning or end
      let jsonText = result.response.trim();
      
      // If the response starts with ``` or ```json (code block), extract only the JSON part
      if (jsonText.startsWith('```')) {
        const endIndex = jsonText.lastIndexOf('```');
        if (endIndex > 3) {
          // Extract content between first ``` and last ```
          jsonText = jsonText.substring(jsonText.indexOf('\n') + 1, endIndex).trim();
        }
      }
      
      parsedQuestions = JSON.parse(jsonText);
      console.log("Successfully parsed questions:", parsedQuestions);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.log("Raw AI response:", result.response);
      updateDebugInfoField('response', `PARSE ERROR: ${parseError}\n\nRaw: ${result.response}`);
      return null;
    }
    
    // Process the parsed questions to ensure all fields are present
    const processedQuestions = parsedQuestions.map((q, index) => ({
      id: index + 1,
      theme: q.theme || `Theme ${index + 1}`,
      question: q.question || `Question ${index + 1}`,
      leftLabel: q.leftLabel || 'Low',
      rightLabel: q.rightLabel || 'High',
      sliderValue: 50 // Default slider position
    }));
    
    return processedQuestions;
  } catch (error) {
    console.error("Error generating slider questions with AI:", error);
    updateDebugInfoField('error', error instanceof Error ? error.message : String(error));
    return null;
  }
};
