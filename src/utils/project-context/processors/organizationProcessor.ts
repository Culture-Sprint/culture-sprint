
/**
 * Process organization information
 */
export function processOrganizationInfo(context: string, activityResponses: Record<string, any>): string {
  const orgKeys = ['organizationAbout', 'organizationHistory', 'organizationValues', 'organization', 'organizationInfo'];
  let orgContext = '';
  let hasOrgData = false;
  
  for (const key of orgKeys) {
    if (activityResponses[key]) {
      try {
        const orgData = activityResponses[key];
        if (!hasOrgData) {
          orgContext += `\nORGANIZATION INFORMATION:\n`;
          hasOrgData = true;
        }
        
        if (typeof orgData === 'string') {
          orgContext += `- ${key.replace('organization', '')}: ${orgData}\n`;
        } else if (typeof orgData === 'object' && orgData !== null) {
          // Process all fields within the organization object
          Object.entries(orgData).forEach(([field, value]) => {
            if (typeof value === 'string' && value.trim()) {
              orgContext += `- ${key.replace('organization', '')} ${field}: ${value}\n`;
            } else if (typeof value === 'object' && value !== null) {
              // Handle nested objects
              try {
                orgContext += `- ${key.replace('organization', '')} ${field}:\n`;
                Object.entries(value as object).forEach(([nestedField, nestedValue]) => {
                  if (typeof nestedValue === 'string' && nestedValue.trim()) {
                    orgContext += `  - ${nestedField}: ${nestedValue}\n`;
                  }
                });
              } catch (err) {
                console.error(`Error processing nested org data for ${key}.${field}:`, err);
              }
            }
          });
        }
      } catch (e) {
        console.error(`Error processing ${key} data:`, e);
      }
    }
  }
  
  return context + (hasOrgData ? orgContext : '');
}
