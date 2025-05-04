
/**
 * Process alternative factor sources when primary sources are not available
 */
import { extractFactorArray } from './factorUtils';

/**
 * Try alternative locations for factors if the main location failed
 */
export function processAlternativeFactors(context: string, activityResponses: Record<string, any>): boolean {
  let factorsProcessed = false;
  
  try {
    // Alternative 1: altFactors (from fetchAdditionalContextData)
    if (!factorsProcessed && activityResponses.altFactors) {
      console.log("Checking alternative factor location 1:", activityResponses.altFactors);
      context += `\nPROJECT FACTORS (ALTERNATIVE SOURCE):\n`;
      
      factorsProcessed = processAltFactorSource(context, activityResponses.altFactors);
    }
    
    // Alternative 2: moreAltFactors
    if (!factorsProcessed && activityResponses.moreAltFactors) {
      console.log("Checking alternative factor location 2:", activityResponses.moreAltFactors);
      context += `\nPROJECT FACTORS (ALTERNATIVE SOURCE 2):\n`;
      
      factorsProcessed = processAltFactorSource(context, activityResponses.moreAltFactors);
    }
    
    // Last resort: Look for factor-related information in other fields
    if (!factorsProcessed) {
      factorsProcessed = processFactorsFromOtherSources(context, activityResponses);
    }
  } catch (e) {
    console.error("Error processing alternative factors:", e);
  }
  
  return factorsProcessed;
}

/**
 * Process an alternative factor source
 */
function processAltFactorSource(context: string, factorsData: any): boolean {
  let factorsProcessed = false;
  
  if (typeof factorsData === 'object') {
    let factorText = '';
    
    // Try to find factors in any of the likely field names
    const possibleFieldNames = ['influencing_factors', 'factors', 'key_factors', 'projectFactors', 'text', 'content'];
    for (const fieldName of possibleFieldNames) {
      if (factorsData[fieldName] && typeof factorsData[fieldName] === 'string') {
        factorText = factorsData[fieldName];
        break;
      }
    }
    
    if (factorText) {
      // Split the factors by newlines or bullets and process each
      const factorsArray = extractFactorArray(factorText);
      
      if (factorsArray.length > 0) {
        factorsArray.forEach(factor => {
          context += `- ${factor}\n`;
        });
        factorsProcessed = true;
      } else {
        // Use raw text if needed
        context += `- ${factorText}\n`;
        factorsProcessed = true;
      }
    } else {
      // Try each field directly
      for (const [key, value] of Object.entries(factorsData)) {
        if (typeof value === 'string' && value.trim()) {
          context += `- ${key}: ${value}\n`;
          factorsProcessed = true;
        }
      }
    }
  } else if (typeof factorsData === 'string') {
    context += `- ${factorsData}\n`;
    factorsProcessed = true;
  }
  
  return factorsProcessed;
}

/**
 * Look for factor-related information in other fields as a last resort
 */
function processFactorsFromOtherSources(context: string, activityResponses: Record<string, any>): boolean {
  let factorsProcessed = false;
  
  console.log("Looking for factor-related info in other responses");
  // Look in project descriptions, hopes, or other fields for text that might contain factors
  const otherSources = ['hopes', 'experiences', 'projectDescription', 'projectScope', 'context', 'background'];
  
  for (const source of otherSources) {
    if (activityResponses[source]) {
      const sourceData = activityResponses[source];
      
      if (typeof sourceData === 'object') {
        // Try each property in the object
        for (const [key, value] of Object.entries(sourceData)) {
          if (typeof value === 'string' && 
              (key.includes('factor') || 
               key.includes('influence') || 
               key.includes('motivat') || 
               key.includes('drive') ||
               key.includes('barrier'))) {
            context += `\nFACTOR-RELATED INFORMATION (from ${source}.${key}):\n`;
            context += `- ${value}\n`;
            factorsProcessed = true;
            break;
          }
        }
      } else if (typeof sourceData === 'string') {
        // Check if the string contains factor-related terms
        if (source.includes('factor') || source.includes('influence')) {
          context += `\nFACTOR-RELATED INFORMATION (from ${source}):\n`;
          context += `- ${sourceData}\n`;
          factorsProcessed = true;
        }
      }
      
      if (factorsProcessed) break;
    }
  }
  
  return factorsProcessed;
}
