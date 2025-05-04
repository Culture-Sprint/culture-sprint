
/**
 * Factors formatting module
 */

/**
 * Format factors (most important for slider questions)
 */
export const formatFactors = (rawData: Record<string, any>): string => {
  let text = '\n\nKEY FACTORS:\n';
  
  // Try primary factors location
  if (rawData.factors) {
    return formatFactorsData(text, rawData.factors);
  }
  
  // Try alternative factors locations
  const altFactorKeys = Object.keys(rawData).filter(key => 
    key.includes('factor') || 
    key.includes('_discover_factors') || 
    key.includes('influencing')
  );
  
  if (altFactorKeys.length > 0) {
    for (const key of altFactorKeys) {
      const formattedText = formatFactorsData(text, rawData[key]);
      if (formattedText !== text) {
        return formattedText;
      }
    }
  }
  
  return '';
};

/**
 * Format factors data from various possible structures
 */
export const formatFactorsData = (baseText: string, data: any): string => {
  let text = baseText;
  
  if (!data) return '';
  
  if (typeof data === 'string') {
    text += `• ${data}\n`;
    return text;
  }
  
  if (Array.isArray(data)) {
    data.forEach((factor, index) => {
      if (typeof factor === 'string') {
        text += `• Factor ${index + 1}: ${factor}\n`;
      } else if (factor && typeof factor === 'object') {
        const factorText = factor.text || factor.factor || factor.name || factor.value || '';
        if (factorText) {
          text += `• Factor ${index + 1}: ${factorText}\n`;
        }
      }
    });
    return text;
  }
  
  if (typeof data === 'object') {
    // Check if it has a factors array
    if (data.factors && Array.isArray(data.factors)) {
      data.factors.forEach((factor: any, index: number) => {
        const factorText = typeof factor === 'string' 
          ? factor 
          : factor?.text || factor?.factor || factor?.name || factor?.value || '';
        
        if (factorText) {
          text += `• Factor ${index + 1}: ${factorText}\n`;
        }
      });
      return text;
    }
    
    // Check for influencing_factors object structure
    if (data.influencing_factors) {
      const influencingFactors = data.influencing_factors;
      
      if (Array.isArray(influencingFactors)) {
        influencingFactors.forEach((factor, index) => {
          const factorText = typeof factor === 'string' 
            ? factor 
            : factor?.text || factor?.factor || factor?.name || factor?.value || '';
          
          if (factorText) {
            text += `• Factor ${index + 1}: ${factorText}\n`;
          }
        });
      } else if (typeof influencingFactors === 'string') {
        // Try to parse as comma-separated list
        const factors = influencingFactors.split(/,|;/).map(f => f.trim()).filter(f => f);
        factors.forEach((factor, index) => {
          text += `• Factor ${index + 1}: ${factor}\n`;
        });
      }
      return text;
    }
    
    // Try to extract from any field that might contain factors
    let foundFactors = false;
    Object.entries(data).forEach(([key, value]) => {
      if (
        (key.includes('factor') || key.includes('influence')) && 
        (typeof value === 'string' || Array.isArray(value))
      ) {
        foundFactors = true;
        if (typeof value === 'string') {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            const itemText = typeof item === 'string' ? item : item?.text || item?.value || '';
            if (itemText) {
              text += `• ${formatFieldName(key)} ${index + 1}: ${itemText}\n`;
            }
          });
        }
      }
    });
    
    return foundFactors ? text : '';
  }
  
  return '';
};

// Import the utility function
import { formatFieldName } from '../utils/formattingUtils';
