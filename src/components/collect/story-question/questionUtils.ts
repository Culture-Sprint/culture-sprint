
/**
 * Process a raw question string to ensure it's display-ready
 * This includes handling HTML entities, newlines, and other formatting issues
 */
export function processQuestion(questionText: string): string {
  if (!questionText || questionText.trim() === "") return "";
  
  // Clean the question text
  const cleaned = questionText
    .trim()
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
    
  console.log("Question processed (plain text):", JSON.stringify(cleaned));
  
  return cleaned;
}
