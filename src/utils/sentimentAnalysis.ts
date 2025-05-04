
import { supabase } from "@/integrations/supabase/client";
import { determineEmotionLocally } from "@/components/dashboard/slider-insights/hooks/utils/emotionUtils";

/**
 * Categorizes an emotion using ChatGPT API
 * @param emotion The emotion text to categorize
 * @returns A sentiment category: "positive", "neutral", or "negative"
 */
export const categorizeEmotion = async (emotion: string): Promise<"positive" | "neutral" | "negative"> => {
  try {
    // Skip API call if no emotion specified
    if (!emotion || emotion === "unspecified") {
      console.log("SENTIMENT - No emotion specified, defaulting to neutral");
      return "neutral";
    }
    
    // First try to determine sentiment locally
    const localSentiment = determineEmotionLocally(emotion);
    if (localSentiment !== "unknown") {
      console.log(`SENTIMENT - Locally determined "${emotion}" as "${localSentiment}"`);
      return localSentiment;
    }
    
    console.log(`SENTIMENT - Local classification failed, sending request to API for: "${emotion}"`);
    
    const { data, error } = await supabase.functions.invoke('chatgpt', {
      body: {
        requestType: 'sentimentAnalysis',
        emotion: emotion
      }
    });
    
    if (error) {
      console.error("SENTIMENT ERROR - Error categorizing emotion:", error);
      // Default to neutral if there's an error
      return "neutral";
    }
    
    // Ensure the response is one of the expected categories
    const sentiment = data?.sentiment;
    console.log("SENTIMENT RESPONSE:", emotion, "→", sentiment);
    
    if (sentiment === "positive" || sentiment === "negative" || sentiment === "neutral") {
      return sentiment;
    }
    
    console.warn(`SENTIMENT WARNING - Unexpected sentiment value: ${sentiment}, defaulting to neutral`);
    return "neutral";
  } catch (error) {
    console.error("SENTIMENT EXCEPTION - Error calling sentiment analysis function:", error);
    return "neutral";
  }
};
