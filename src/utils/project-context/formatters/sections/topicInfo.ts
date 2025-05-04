
/**
 * Topic information formatting module
 */

/**
 * Format topic information
 */
export const formatTopicInfo = (rawData: Record<string, any>): string => {
  let text = '\n\nTOPIC INFORMATION:\n';
  let hasData = false;
  
  // Topic investigation
  if (rawData.topic) {
    hasData = true;
    const data = rawData.topic;
    
    if (typeof data === 'string') {
      text += `• Topic: ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.topic_description) text += `• Description: ${data.topic_description}\n`;
      if (data.topic_importance) text += `• Importance: ${data.topic_importance}\n`;
      
      Object.entries(data).forEach(([key, value]) => {
        if (!['topic_description', 'topic_importance'].includes(key) && typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  // Topic focus
  if (rawData.focus) {
    hasData = true;
    const data = rawData.focus;
    
    if (typeof data === 'string') {
      text += `• Focus: ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.focus_description) text += `• Focus Description: ${data.focus_description}\n`;
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'focus_description' && typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  // Actors
  if (rawData.actors) {
    hasData = true;
    const data = rawData.actors;
    
    if (typeof data === 'string') {
      text += `• Actors: ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.actors_description) text += `• Actors: ${data.actors_description}\n`;
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'actors_description' && typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  return hasData ? text : '';
};

// Import the utility function
import { formatFieldName } from '../utils/formattingUtils';
