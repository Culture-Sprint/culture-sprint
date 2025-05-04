
import { formatDateYYYYMMDD } from './formattingUtils';

// Convert stories to CSV format
export const convertStoriesToCSV = (stories: any[]) => {
  // First, collect all unique participant question IDs across all stories
  const participantQuestionMap = new Map<string, string>();
  
  stories.forEach(story => {
    if (story.participantResponses && story.participantResponses.length > 0) {
      story.participantResponses.forEach((resp: { question_id: string; question_text: string }) => {
        if (!participantQuestionMap.has(resp.question_id)) {
          participantQuestionMap.set(resp.question_id, resp.question_text);
        }
      });
    }
  });
  
  // Convert to array of question IDs and texts
  const participantQuestions = Array.from(participantQuestionMap.entries()).map(([id, text]) => ({
    id,
    text
  }));
  
  // Define CSV header with participant question columns and slider labels
  const csvHeader = [
    'ID', 
    'Date', 
    'Story Title', 
    'Story Text', 
    'Emotional Response', 
    'Slider 1', 
    'Slider 1 Left Label',
    'Slider 1 Right Label',
    'Slider 2', 
    'Slider 2 Left Label',
    'Slider 2 Right Label',
    'Slider 3',
    'Slider 3 Left Label',
    'Slider 3 Right Label'
  ];
  
  // Add participant question columns to header
  participantQuestions.forEach(question => {
    csvHeader.push(question.text);
  });
  
  // Add Additional Comments as the last column
  csvHeader.push('Additional Comments');
  
  // Format data rows
  const csvRows = stories.map(story => {
    // Extract slider values and labels
    let sliderValues = [null, null, null]; // Default empty values for 3 sliders
    let sliderLeftLabels = ["", "", ""];
    let sliderRightLabels = ["", "", ""];
    let sliderTexts = ["", "", ""];
    
    // If the story has slider responses, extract the first 3
    if (story.sliderResponses && story.sliderResponses.length > 0) {
      // Sort slider responses by question_id to ensure consistent ordering
      const sortedResponses = [...story.sliderResponses].sort((a, b) => a.question_id - b.question_id);
      
      // Get values and labels for up to 3 sliders
      for (let i = 0; i < Math.min(sortedResponses.length, 3); i++) {
        sliderValues[i] = sortedResponses[i].value;
        sliderLeftLabels[i] = sortedResponses[i].left_label || "";
        sliderRightLabels[i] = sortedResponses[i].right_label || "";
        sliderTexts[i] = sortedResponses[i].question_text || `Slider Question ${i+1}`;
      }
    }
    
    // Create a map of participant responses for this story
    const participantResponseMap = new Map<string, string>();
    if (story.participantResponses && story.participantResponses.length > 0) {
      story.participantResponses.forEach((resp: { question_id: string; response: string }) => {
        participantResponseMap.set(resp.question_id, resp.response);
      });
    }
    
    // Start with the basic story data
    const rowData = [
      story.id,
      formatDateYYYYMMDD(story.date),
      `"${story.title?.replace(/"/g, '""') || ''}"`,
      `"${story.text?.replace(/"/g, '""') || ''}"`,
      story.feeling || '',
      sliderValues[0] !== null ? sliderValues[0] : '', // Slider 1
      `"${sliderLeftLabels[0].replace(/"/g, '""')}"`, // Slider 1 Left Label
      `"${sliderRightLabels[0].replace(/"/g, '""')}"`, // Slider 1 Right Label
      sliderValues[1] !== null ? sliderValues[1] : '', // Slider 2
      `"${sliderLeftLabels[1].replace(/"/g, '""')}"`, // Slider 2 Left Label
      `"${sliderRightLabels[1].replace(/"/g, '""')}"`, // Slider 2 Right Label
      sliderValues[2] !== null ? sliderValues[2] : '', // Slider 3
      `"${sliderLeftLabels[2].replace(/"/g, '""')}"`, // Slider 3 Left Label
      `"${sliderRightLabels[2].replace(/"/g, '""')}"`, // Slider 3 Right Label
    ];
    
    // Add participant responses in the same order as the header
    participantQuestions.forEach(question => {
      const response = participantResponseMap.get(question.id) || '';
      rowData.push(`"${response.replace(/"/g, '""')}"`);
    });
    
    // Add additional comments at the end
    rowData.push(story.additional_comments ? `"${story.additional_comments.replace(/"/g, '""')}"` : '');
    
    return rowData;
  });
  
  // Combine header and rows
  return [csvHeader, ...csvRows]
    .map(row => row.join(','))
    .join('\n');
};

// Download CSV file
export const downloadCSV = (csvContent: string, fileName: string) => {
  // Add UTF-8 BOM to ensure Excel opens the file with the correct encoding
  const BOM = "\uFEFF";
  const csvContentWithBOM = BOM + csvContent;
  
  // Create blob with the CSV content
  const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8;' });
  
  // Create object URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create download link
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  // Add link to document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up by revoking the object URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};
