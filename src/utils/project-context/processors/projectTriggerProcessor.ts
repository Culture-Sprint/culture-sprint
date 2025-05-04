
/**
 * Process project trigger information
 */

/**
 * Process project trigger information from activity responses
 */
export function processProjectTrigger(context: string, activityResponses: Record<string, any>): string {
  if (activityResponses.projectTrigger) {
    try {
      const triggerData = activityResponses.projectTrigger;
      context += `\nPROJECT TRIGGER:\n`;
      
      if (typeof triggerData === 'string') {
        context += `- ${triggerData}\n`;
      } else if (typeof triggerData === 'object' && triggerData !== null) {
        if (triggerData.project_trigger) {
          context += `- ${triggerData.project_trigger}\n`;
        }
        
        // Add any other fields that might be present
        Object.entries(triggerData).forEach(([key, value]) => {
          if (key !== 'project_trigger') {
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
                console.error(`Error processing nested trigger data for ${key}:`, err);
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("Error processing project trigger data:", e);
    }
  }
  
  return context;
}
