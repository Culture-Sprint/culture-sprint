
/**
 * Utilities for processing and displaying context data
 */
export interface ContextSection {
  title: string;
  content: string[];
}

/**
 * Processes the raw context string into sections for better visualization
 */
export const processContext = (context: string): ContextSection[] => {
  const lines = context.split('\n').filter(line => line.trim() !== '');
  const sections: ContextSection[] = [];
  
  let currentSection: ContextSection | null = null;
  
  for (const line of lines) {
    // Check if line is a section header (uppercase followed by colon)
    if (line.match(/^[A-Z][A-Z\s]+:/) || line.match(/^SYSTEM:/)) {
      // Save previous section if it exists
      if (currentSection) {
        sections.push(currentSection);
      }
      
      // Start new section
      currentSection = {
        title: line,
        content: []
      };
    } else if (currentSection) {
      // Add line to current section
      currentSection.content.push(line);
    } else {
      // If no section yet, create a default one
      currentSection = {
        title: "GENERAL INFO",
        content: [line]
      };
    }
  }
  
  // Add the last section
  if (currentSection) {
    sections.push(currentSection);
  }
  
  return sections;
};

/**
 * Gets statistics about the context
 * Ensures unique project name extraction and prevents duplicated info
 */
export const getContextStats = (context: string, contextSections: ContextSection[]) => {
  // Extract project name more carefully to avoid duplicates
  const projectNameLine = context.split('\n')
    .find(line => line.includes('Project:') && !line.includes('PROJECT'));
    
  const projectName = projectNameLine
    ? projectNameLine.replace('Project:', '').trim()
    : 'Unknown';
    
  return {
    totalLength: context.length,
    sectionCount: contextSections.length,
    projectName,
  };
};
