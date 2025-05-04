
/**
 * Organization information formatting module
 */

/**
 * Format organization information
 */
export const formatOrganizationInfo = (rawData: Record<string, any>): string => {
  let text = '\n\nORGANIZATION INFORMATION:\n';
  let hasData = false;
  
  // Organization about
  if (rawData.organizationAbout) {
    hasData = true;
    const data = rawData.organizationAbout;
    
    if (typeof data === 'string') {
      text += `• About: ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.org_about) text += `• About: ${data.org_about}\n`;
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'org_about' && typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  // Organization history
  if (rawData.organizationHistory) {
    hasData = true;
    const data = rawData.organizationHistory;
    
    if (typeof data === 'string') {
      text += `• History: ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.org_history) text += `• History: ${data.org_history}\n`;
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'org_history' && typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  // Organization values
  if (rawData.organizationValues) {
    hasData = true;
    const data = rawData.organizationValues;
    
    if (typeof data === 'string') {
      text += `• Values: ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.org_values) text += `• Values: ${data.org_values}\n`;
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'org_values' && typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  return hasData ? text : '';
};

// Import the utility function
import { formatFieldName } from '../utils/formattingUtils';
