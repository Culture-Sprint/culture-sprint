
// Parse CSV file for import
export const parseCSVFile = async (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target || !event.target.result) {
          reject(new Error('File could not be read'));
          return;
        }
        
        const csvContent = event.target.result as string;
        // Remove BOM if present
        const content = csvContent.replace(/^\uFEFF/, '');
        
        // Split by lines and handle potential quoted content
        const lines = content.split(/\r?\n/);
        
        // Parse header
        if (lines.length === 0) {
          reject(new Error('CSV file is empty'));
          return;
        }
        
        const header = parseCSVLine(lines[0]);
        
        // Validate required columns
        const requiredColumns = ['ID', 'Date', 'Story Title', 'Story Text', 'Emotional Response'];
        const missingColumns = requiredColumns.filter(col => !header.includes(col));
        
        if (missingColumns.length > 0) {
          reject(new Error(`CSV is missing required columns: ${missingColumns.join(', ')}`));
          return;
        }
        
        // Parse data rows
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() === '') continue; // Skip empty lines
          
          const row = parseCSVLine(lines[i]);
          if (row.length !== header.length) {
            console.warn(`Row ${i} has ${row.length} columns instead of ${header.length}, skipping`);
            continue;
          }
          
          const rowData: Record<string, any> = {};
          header.forEach((column, index) => {
            rowData[column] = row[index];
          });
          
          rows.push(rowData);
        }
        
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading the file'));
    };
    
    reader.readAsText(file);
  });
};

// Helper to parse a CSV line with proper handling of quoted values
const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Handle escaped quotes (two double quotes in a row)
      if (i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current);
  return result;
};

// Convert CSV data to story format for import
export const convertCSVToStories = (csvData: any[]): any[] => {
  return csvData.map(row => {
    // Extract slider values if present
    const sliderResponses = [];
    for (let i = 1; i <= 3; i++) {
      const sliderVal = row[`Slider ${i}`];
      // Include the actual slider question text from column header if present
      const questionText = row[`Slider ${i} Question Text`] || `Slider Question ${i}`;
      const leftLabel = row[`Slider ${i} Left Label`] || '';
      const rightLabel = row[`Slider ${i} Right Label`] || '';
      
      if (sliderVal !== undefined && sliderVal !== '') {
        sliderResponses.push({
          question_id: i,
          question_text: questionText,
          value: parseInt(sliderVal),
          response_type: 'answered',
          left_label: leftLabel,
          right_label: rightLabel
        });
      }
    }
    
    // Extract participant responses
    const participantResponses = [];
    Object.keys(row).forEach(key => {
      // Skip the standard columns
      const standardColumns = [
        'ID', 'Date', 'Story Title', 'Story Text', 'Emotional Response', 
        'Slider 1', 'Slider 1 Left Label', 'Slider 1 Right Label',
        'Slider 2', 'Slider 2 Left Label', 'Slider 2 Right Label',
        'Slider 3', 'Slider 3 Left Label', 'Slider 3 Right Label',
        'Additional Comments'
      ];
      
      if (!standardColumns.includes(key) && row[key] !== '') {
        participantResponses.push({
          question_id: key.replace(/\s+/g, '_').toLowerCase(),
          question_text: key,
          response: row[key]
        });
      }
    });
    
    return {
      // Use existing ID if it matches UUID format, otherwise generate a new one
      id: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(row['ID']) 
          ? row['ID'] 
          : crypto.randomUUID(),
      title: row['Story Title'] || 'Untitled Story',
      text: row['Story Text'] || '',
      feeling: row['Emotional Response'] || 'unspecified',
      date: row['Date'] || new Date().toISOString(),
      additional_comments: row['Additional Comments'] || '',
      sliderResponses,
      participantResponses
    };
  });
};

// Validate CSV file extension
export const isCSVFile = (file: File): boolean => {
  return file.name.toLowerCase().endsWith('.csv');
};
