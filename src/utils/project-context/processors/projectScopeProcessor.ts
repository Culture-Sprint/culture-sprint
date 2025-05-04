
/**
 * Process project scope information
 */

/**
 * Process project scope information from activity responses
 */
export function processProjectScope(context: string, activityResponses: Record<string, any>): string {
  if (activityResponses.projectScope) {
    try {
      const scopeData = activityResponses.projectScope;
      context += `\nPROJECT SCOPE:\n`;
      
      if (typeof scopeData === 'string') {
        context += `- ${scopeData}\n`;
      } else if (typeof scopeData === 'object' && scopeData !== null) {
        if (scopeData.project_about) context += `- About: ${scopeData.project_about}\n`;
        if (scopeData.problem_solving) context += `- Problem to Solve: ${scopeData.problem_solving}\n`;
        
        // Add any other fields that might be present
        Object.entries(scopeData).forEach(([key, value]) => {
          if (!['project_about', 'problem_solving'].includes(key)) {
            if (typeof value === 'string' && value.trim()) {
              context += `- ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: ${value}\n`;
            } else if (typeof value === 'object' && value !== null) {
              try {
                Object.entries(value as object).forEach(([nestedKey, nestedValue]) => {
                  if (typeof nestedValue === 'string' && nestedValue.trim()) {
                    context += `- ${key} ${nestedKey}: ${nestedValue}\n`;
                  }
                });
              } catch (err) {
                console.error(`Error processing nested scope data for ${key}:`, err);
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("Error processing project scope data:", e);
    }
  }
  
  return context;
}
