
/**
 * Process project success information
 */

/**
 * Process project success information from activity responses
 */
export function processProjectSuccess(context: string, activityResponses: Record<string, any>): string {
  if (activityResponses.projectSuccess) {
    try {
      const successData = activityResponses.projectSuccess;
      context += `\nPROJECT SUCCESS CRITERIA:\n`;
      
      if (typeof successData === 'string') {
        context += `- ${successData}\n`;
      } else if (typeof successData === 'object' && successData !== null) {
        if (successData.achievement) context += `- Achievement: ${successData.achievement}\n`;
        if (successData.success_criteria) {
          context += `- Success Criteria: ${successData.success_criteria}\n`;
          
          // Try to parse any bullet points in success criteria for better formatting
          const criteria = successData.success_criteria;
          if (criteria.includes('•') || criteria.includes('-') || criteria.includes('*')) {
            const bulletPoints = criteria
              .split(/\n|•|⦁|·|●|\*|\-/)
              .map(point => point.trim())
              .filter(point => point.length > 0);
            
            if (bulletPoints.length > 1) {
              context += "Success criteria details:\n";
              bulletPoints.forEach(point => {
                if (point) context += `  • ${point}\n`;
              });
            }
          }
        }
        
        // Add any other fields that might be present
        Object.entries(successData).forEach(([key, value]) => {
          if (!['achievement', 'success_criteria'].includes(key)) {
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
                console.error(`Error processing nested success data for ${key}:`, err);
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("Error processing project success data:", e);
    }
  }
  
  return context;
}
