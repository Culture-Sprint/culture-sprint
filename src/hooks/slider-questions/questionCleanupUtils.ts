
/**
 * Clean up question text by:
 * - Removing dashes and unnecessary punctuation
 * - Ensuring proper spacing
 * - Capitalizing first letter
 * - Ensuring question ends with proper punctuation
 */
export const cleanQuestionText = (text: string): string => {
  return text
    // Remove any leading/trailing dashes or spaces
    .trim()
    .replace(/^-+|-+$/g, '')
    // Replace dashes inside text with spaces
    .replace(/-+/g, ' ')
    // Fix spaces around punctuation
    .replace(/\s+([.,?!])/g, '$1')
    // Ensure single space after punctuation
    .replace(/([.,?!])\s*/g, '$1 ')
    // Remove double spaces
    .replace(/\s+/g, ' ')
    // Capitalize first letter
    .replace(/^[a-z]/, letter => letter.toUpperCase())
    // Ensure question ends with question mark
    .replace(/[.?!]*$/, '?');
};

/**
 * Clean up label text by:
 * - Removing unnecessary punctuation
 * - Replacing dashes with spaces
 * - Ensuring proper capitalization
 * - Limiting to 3 words
 */
export const cleanLabelText = (text: string): string => {
  return text
    .trim()
    // Remove any dashes
    .replace(/-+/g, ' ')
    // Remove unnecessary punctuation
    .replace(/[.,?!]/g, '')
    // Remove double spaces
    .replace(/\s+/g, ' ')
    // Capitalize first letter of each word
    .replace(/\b\w/g, letter => letter.toUpperCase())
    // Limit to 3 words
    .split(' ')
    .slice(0, 3)
    .join(' ');
};
