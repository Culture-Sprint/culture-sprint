
/**
 * Project context formatting module
 */

/**
 * Format project context information
 */
export const formatProjectContext = (rawData: Record<string, any>): string => {
  let text = '\n\nPROJECT CONTEXT:\n';
  
  // Project description
  if (rawData.projectDescription) {
    const data = rawData.projectDescription;
    if (typeof data === 'string') {
      text += `• Description: ${data}\n`;
    } else if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  // Project scope
  if (rawData.projectScope) {
    const data = rawData.projectScope;
    text += `\nProject Scope:\n`;
    
    if (typeof data === 'string') {
      text += `• ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.project_about) text += `• About: ${data.project_about}\n`;
      if (data.problem_solving) text += `• Problem to Solve: ${data.problem_solving}\n`;
      
      Object.entries(data).forEach(([key, value]) => {
        if (!['project_about', 'problem_solving'].includes(key) && typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  // Project trigger
  if (rawData.projectTrigger) {
    const data = rawData.projectTrigger;
    text += `\nProject Trigger:\n`;
    
    if (typeof data === 'string') {
      text += `• ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.project_trigger) text += `• ${data.project_trigger}\n`;
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'project_trigger' && typeof value === 'string' && value.trim()) {
          text += `• ${formatFieldName(key)}: ${value}\n`;
        }
      });
    }
  }
  
  // Project success criteria
  if (rawData.projectSuccess) {
    const data = rawData.projectSuccess;
    text += `\nProject Success Criteria:\n`;
    
    if (typeof data === 'string') {
      text += `• ${data}\n`;
    } else if (data && typeof data === 'object') {
      if (data.achievement) text += `• Achievement: ${data.achievement}\n`;
      if (data.success_criteria) {
        text += `• Success Criteria: ${data.success_criteria}\n`;
        
        // Try to parse any bullet points in success criteria
        const criteria = data.success_criteria;
        if (criteria.includes('•') || criteria.includes('-') || criteria.includes('*')) {
          const bulletPoints = criteria
            .split(/\n|•|⦁|·|●|\*|\-/)
            .map(point => point.trim())
            .filter(point => point.length > 0);
          
          if (bulletPoints.length > 1) {
            text += "Success criteria details:\n";
            bulletPoints.forEach(point => {
              if (point) text += `  ⦁ ${point}\n`;
            });
          }
        }
      }
    }
  }
  
  return text;
};

// Import the utility function
import { formatFieldName } from '../utils/formattingUtils';
