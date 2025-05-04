
import { ActivityFormData } from "@/types/activity";

/**
 * Extracts influencing factors from project details
 * @param projectDetailsResponse - The response from project-details activity
 * @returns Array of influencing factors (strings)
 */
export const extractInfluencingFactors = (projectDetailsResponse: ActivityFormData | null): string[] => {
  if (!projectDetailsResponse || typeof projectDetailsResponse !== 'object') {
    console.log("No project details found or invalid format");
    return [];
  }

  // Log the entire response to help with debugging
  console.log("Project details response:", projectDetailsResponse);
  
  // Expanded list of possible field names to check for factors
  const possibleFieldNames = [
    'influencing_factors', 
    'influencingFactors', 
    'factors', 
    'influences',
    'discovery_goal',   
    'project_focus',    
    'hope_to_discover',  
    'investigate',       
    'focus',             
    'experiences',       
    'factors_influencing',
    'factors_text',      
    'text',              
    // Add more potential field names
    'key_factors',
    'important_factors',
    'project_factors',
    'research_factors',
    'discovery_factors',
    'insights',
    'themes',
    'areas_of_interest',
    'investigation_areas',
    'considerations'
  ];
  
  let influencingFactorsText = '';
  
  // Try to find the field containing factors
  for (const fieldName of possibleFieldNames) {
    if (fieldName in projectDetailsResponse && 
        typeof projectDetailsResponse[fieldName] === 'string' && 
        projectDetailsResponse[fieldName].trim()) {
      influencingFactorsText = projectDetailsResponse[fieldName] as string;
      console.log(`Found influencing factors in '${fieldName}' field:`, influencingFactorsText);
      break;
    }
  }
  
  // If we still haven't found factors, try to look for it in nested objects
  if (!influencingFactorsText) {
    for (const key in projectDetailsResponse) {
      const value = projectDetailsResponse[key];
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        for (const fieldName of possibleFieldNames) {
          if (fieldName in value && 
              typeof value[fieldName] === 'string' && 
              (value[fieldName] as string).trim()) {
            influencingFactorsText = value[fieldName] as string;
            console.log(`Found influencing factors in nested object '${key}.${fieldName}':`, influencingFactorsText);
            break;
          }
        }
        if (influencingFactorsText) break;
      }
    }
  }
  
  // Check for factors in any string field with specific keywords
  if (!influencingFactorsText) {
    for (const key in projectDetailsResponse) {
      if (typeof projectDetailsResponse[key] === 'string' && 
          (key.toLowerCase().includes('factor') || 
           key.toLowerCase().includes('influence') ||
           key.toLowerCase().includes('consider') ||
           key.toLowerCase().includes('aspect'))) {
        influencingFactorsText = projectDetailsResponse[key] as string;
        console.log(`Found potential factors in field '${key}':`, influencingFactorsText);
        break;
      }
    }
  }
  
  if (!influencingFactorsText) {
    console.log("No influencing factors found in any expected fields");
    return [];
  }

  // Improved splitting logic to handle various formats
  // Split by various delimiters: commas, new lines, bullet points, numbers, semicolons
  const rawFactors = influencingFactorsText
    .split(/[,\n•;]|\d+\.\s*|\*\s*/)
    .map(factor => factor.trim())
    .filter(factor => {
      // Filter out empty strings and very common words that aren't factors
      const isValid = factor.length > 0 && 
                     !['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'by', 'for', 'with', 'to'].includes(factor.toLowerCase());
      return isValid;
    });
  
  // Further cleanup and deduplication
  const uniqueFactors = [...new Set(rawFactors)];
  
  // Order by length (often longer descriptions are more meaningful)
  const sortedFactors = uniqueFactors
    .sort((a, b) => {
      // First sort by length - prioritize moderate length factors (not too short, not too long)
      const aLength = a.length;
      const bLength = b.length;
      
      if (aLength < 3) return 1; // Very short factors go last
      if (bLength < 3) return -1;
      
      // Ideal length is between 5-40 characters
      if (aLength >= 5 && aLength <= 40 && (bLength < 5 || bLength > 40)) return -1;
      if (bLength >= 5 && bLength <= 40 && (aLength < 5 || aLength > 40)) return 1;
      
      // Otherwise sort by length descending (longer factors first)
      return bLength - aLength;
    })
    .slice(0, 8); // Get top 8 factors so we have more to choose from
  
  console.log("Extracted and sorted factors:", sortedFactors);
  
  return sortedFactors;
};
