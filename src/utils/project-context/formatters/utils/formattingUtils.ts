
/**
 * Shared formatting utility functions
 */

/**
 * Format a field name to be more readable
 */
export const formatFieldName = (name: string): string => {
  return name
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

/**
 * Format an object's properties into readable text
 */
export const formatObject = (obj: Record<string, any>, indent: string = ''): string => {
  let text = '';
  
  try {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim()) {
        text += `${indent}• ${formatFieldName(key)}: ${value}\n`;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        text += `${indent}• ${formatFieldName(key)}:\n${formatObject(value, indent + '  ')}`;
      } else if (Array.isArray(value) && value.length > 0) {
        text += `${indent}• ${formatFieldName(key)}:\n`;
        value.forEach((item, index) => {
          if (typeof item === 'string') {
            text += `${indent}  • Item ${index + 1}: ${item}\n`;
          } else if (typeof item === 'object' && item !== null) {
            text += `${indent}  • Item ${index + 1}:\n${formatObject(item, indent + '    ')}`;
          }
        });
      }
    });
  } catch (e) {
    console.error("Error formatting object:", e);
  }
  
  return text;
};
