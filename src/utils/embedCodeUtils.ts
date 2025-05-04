
/**
 * Utilities for generating embeddable HTML code
 */

/**
 * Generates iframe embed code for the public form
 */
export const generateFormEmbedCode = (formId: string): string => {
  const baseUrl = window.location.origin;
  const formUrl = `${baseUrl}/submit-story/${formId}`;
  
  return `<iframe 
  src="${formUrl}" 
  width="100%" 
  height="600px" 
  style="border: 1px solid #eaeaea; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" 
  title="Story Submission Form" 
  frameborder="0" 
  allowtransparency="true">
</iframe>`;
};

/**
 * Generates iframe embed code for the public dashboard
 */
export const generateDashboardEmbedCode = (token: string): string => {
  const baseUrl = window.location.origin;
  const dashboardUrl = `${baseUrl}/public-dashboard/${token}`;
  
  return `<iframe 
  src="${dashboardUrl}" 
  width="100%" 
  height="800px" 
  style="border: 1px solid #eaeaea; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);" 
  title="Project Dashboard" 
  frameborder="0" 
  allowtransparency="true">
</iframe>`;
};
