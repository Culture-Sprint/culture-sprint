
/**
 * Process project factors from activity responses
 */
import { extractFactorArray } from './factorUtils';

/**
 * Process factors from activity response data
 */
export function processFactors(context: string, activityResponses: Record<string, any>): boolean {
  let factorsProcessed = false;
  
  try {
    // Check for factors in the primary location
    if (activityResponses.factors) {
      const factorsData = activityResponses.factors;
      console.log("Processing factors data:", factorsData);
      
      context += `\nPROJECT FACTORS:\n`;
      
      if (typeof factorsData === 'object' && factorsData.influencing_factors) {
        const factorText = factorsData.influencing_factors;
        
        // Split the factors by newlines or bullets and process each
        const factorsArray = extractFactorArray(factorText);
        
        if (factorsArray.length > 0) {
          factorsArray.forEach(factor => {
            context += `- ${factor}\n`;
          });
          factorsProcessed = true;
        } else {
          // Try to use the raw text if we couldn't parse bullet points
          context += `- ${factorText}\n`;
          factorsProcessed = true;
        }
      } else if (typeof factorsData === 'string' && factorsData.trim()) {
        // Handle case where the whole response is just a string
        context += `- ${factorsData}\n`;
        factorsProcessed = true;
      } else if (typeof factorsData === 'object' && factorsData !== null) {
        // Try to extract factors from arbitrary object structure
        for (const [key, value] of Object.entries(factorsData)) {
          if (typeof value === 'string' && value.trim()) {
            if (key.includes('factor') || key.includes('influence') || key === 'text' || key === 'content') {
              context += `- ${value}\n`;
              factorsProcessed = true;
            } else {
              context += `- ${key}: ${value}\n`;
              factorsProcessed = true;
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error processing factors:", e);
  }
  
  return factorsProcessed;
}
