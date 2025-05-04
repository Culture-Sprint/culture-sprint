
/**
 * Parses AI responses into slider theme objects
 */
import { SliderTheme } from "@/components/design/defaultSliderThemes";

/**
 * Parses the AI response into slider theme objects
 */
export const parseAIResponse = (response: string): SliderTheme[] | null => {
  try {
    // Try to extract JSON from the response (in case there's extra text)
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error("No JSON found in response");
      return null;
    }
    
    const jsonString = jsonMatch[0];
    let parsedData = JSON.parse(jsonString);
    
    // Validate the parsed data
    if (!Array.isArray(parsedData)) {
      console.error("Parsed data is not an array");
      return null;
    }
    
    // Map the parsed data to slider themes
    return parsedData.map((item, index) => ({
      id: index + 1,
      theme: item.theme || `Theme ${index + 1}`,
      question: item.question || "How would you rate this aspect?",
      leftLabel: item.leftLabel || "Low",
      rightLabel: item.rightLabel || "High",
      sliderValue: 50
    }));
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return null;
  }
};
