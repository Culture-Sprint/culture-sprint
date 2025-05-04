
/**
 * Process topic information
 */
export function processTopic(context: string, activityResponses: Record<string, any>): string {
  const topicKeys = ['topic', 'focus', 'planningTopic', 'focusArea', 'topicArea', 'topicInvestigation'];
  let topicContext = '';
  let hasTopicData = false;
  
  for (const key of topicKeys) {
    if (activityResponses[key]) {
      try {
        const topicData = activityResponses[key];
        if (!hasTopicData) {
          topicContext += `\nTOPIC INVESTIGATION:\n`;
          hasTopicData = true;
        }
        
        if (typeof topicData === 'string') {
          topicContext += `- ${key}: ${topicData}\n`;
        } else if (typeof topicData === 'object' && topicData !== null) {
          const topicFields = [
            'topic', 'investigation_topic', 'description', 'importance',
            'focus', 'focus_area', 'explanation', 'value', 'area', 
            'reason', 'details', 'significance', 'motivation'
          ];
          
          // First process common fields in a standard order
          topicFields.forEach(field => {
            if (topicData[field] && typeof topicData[field] === 'string' && topicData[field].trim()) {
              topicContext += `- ${key} ${field.replace('_', ' ')}: ${topicData[field]}\n`;
            }
          });
          
          // Then process any remaining fields
          Object.entries(topicData).forEach(([field, value]) => {
            if (!topicFields.includes(field) && typeof value === 'string' && value.trim()) {
              topicContext += `- ${key} ${field.replace('_', ' ')}: ${value}\n`;
            } else if (typeof value === 'object' && value !== null) {
              // Handle nested objects
              try {
                topicContext += `- ${key} ${field.replace('_', ' ')}:\n`;
                Object.entries(value as object).forEach(([nestedField, nestedValue]) => {
                  if (typeof nestedValue === 'string' && nestedValue.trim()) {
                    topicContext += `  - ${nestedField.replace('_', ' ')}: ${nestedValue}\n`;
                  }
                });
              } catch (err) {
                console.error(`Error processing nested topic data for ${key}.${field}:`, err);
              }
            }
          });
        }
      } catch (e) {
        console.error(`Error processing ${key} data:`, e);
      }
    }
  }
  
  return context + (hasTopicData ? topicContext : '');
}
