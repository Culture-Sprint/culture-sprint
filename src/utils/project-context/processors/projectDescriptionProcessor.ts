
/**
 * Process project description information
 */

/**
 * Process project description information from activity responses
 */
export function processProjectDescription(context: string, activityResponses: Record<string, any>): string {
  if (activityResponses.projectDescription) {
    try {
      const projectDetails = activityResponses.projectDescription;
      context += `\nPROJECT CONTEXT DETAILS:\n`;
      
      if (typeof projectDetails === 'string') {
        context += `- Description: ${projectDetails}\n`;
      } else if (typeof projectDetails === 'object' && projectDetails !== null) {
        if (projectDetails.purpose) context += `- Purpose: ${projectDetails.purpose}\n`;
        if (projectDetails.audience) context += `- Audience: ${projectDetails.audience}\n`;
        if (projectDetails.goals) context += `- Goals: ${projectDetails.goals}\n`;
        if (projectDetails.description) context += `- Description: ${projectDetails.description}\n`;
        
        // Add any other fields that might be present
        Object.entries(projectDetails).forEach(([key, value]) => {
          if (!['purpose', 'audience', 'goals', 'description'].includes(key) && typeof value === 'string' && value.trim()) {
            context += `- ${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}: ${value}\n`;
          }
        });
      }
    } catch (e) {
      console.error("Error processing projectDescription:", e);
    }
  }
  
  return context;
}
