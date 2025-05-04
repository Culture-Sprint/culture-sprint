
export const extractJsonFromAIResponse = (response: string): any => {
  if (!response || typeof response !== 'string') {
    console.error("Invalid response:", response);
    return null;
  }

  console.log("Attempting to extract JSON from response...");
  
  try {
    try {
      const trimmed = response.trim();
      return JSON.parse(trimmed);
    } catch (e) {
      console.log("Direct parsing failed, trying other methods...");
    }
    
    const arrayMatch = response.match(/\[\s*\{.*?\}\s*(?:,\s*\{.*?\}\s*)*\]/s);
    if (arrayMatch) {
      try {
        const arrayStr = arrayMatch[0];
        console.log("Found array pattern:", arrayStr.substring(0, 50) + "...");
        return JSON.parse(arrayStr);
      } catch (e) {
        console.log("Array pattern parsing failed:", e);
      }
    }
    
    try {
      if (response.trim().startsWith('[') && !response.trim().endsWith(']')) {
        let fixedJson = response.trim();
        let braceCount = 0;
        let squareBracketCount = 0;
        let lastValidChar = 0;
        
        for (let i = 0; i < fixedJson.length; i++) {
          if (fixedJson[i] === '{') braceCount++;
          else if (fixedJson[i] === '}') {
            braceCount--;
            if (braceCount === 0 && squareBracketCount === 1) lastValidChar = i;
          }
          else if (fixedJson[i] === '[') squareBracketCount++;
          else if (fixedJson[i] === ']') {
            squareBracketCount--;
            if (squareBracketCount === 0) {
              lastValidChar = i;
              break;
            }
          }
        }
        
        if (lastValidChar > 0) {
          const repairedJson = fixedJson.substring(0, lastValidChar + 1) + 
                            (fixedJson[lastValidChar] !== ']' ? ']' : '');
          console.log("Attempting repair with:", repairedJson.substring(0, 50) + "...");
          return JSON.parse(repairedJson);
        }
      }
    } catch (e) {
      console.log("JSON repair attempt failed:", e);
    }
    
    const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      try {
        const codeContent = codeBlockMatch[1].trim();
        console.log("Found code block:", codeContent.substring(0, 50) + "...");
        return JSON.parse(codeContent);
      } catch (e) {
        console.log("Code block parsing failed:", e);
      }
    }
    
    const firstBracket = response.indexOf('[');
    const lastBracket = response.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1 && firstBracket < lastBracket) {
      try {
        const jsonSubstring = response.substring(firstBracket, lastBracket + 1);
        console.log("Extracted substring:", jsonSubstring.substring(0, 50) + "...");
        return JSON.parse(jsonSubstring);
      } catch (e) {
        console.log("Substring parsing failed:", e);
      }
    }
    
    let fixedJson = response;
    
    fixedJson = fixedJson.replace(/'/g, '"');
    
    fixedJson = fixedJson.replace(/,\s*(?=\}|\])/g, '');
    
    const openBraces = (fixedJson.match(/\{/g) || []).length;
    const closeBraces = (fixedJson.match(/\}/g) || []).length;
    const openBrackets = (fixedJson.match(/\[/g) || []).length;
    const closeBrackets = (fixedJson.match(/\]/g) || []).length;
    
    if (openBraces > closeBraces) {
      fixedJson = fixedJson + '}'.repeat(openBraces - closeBraces);
    }
    
    if (openBrackets > closeBrackets) {
      fixedJson = fixedJson + ']'.repeat(openBrackets - closeBrackets);
    }
    
    const fixedMatch = fixedJson.match(/\[\s*\{.*?\}\s*(?:,\s*\{.*?\}\s*)*\]/s);
    if (fixedMatch) {
      try {
        console.log("Attempting to parse fixed JSON:", fixedMatch[0].substring(0, 50) + "...");
        return JSON.parse(fixedMatch[0]);
      } catch (e) {
        console.log("Fixed JSON parsing failed:", e);
      }
    }
    
    if (response.includes('"theme":') && response.includes('"storyIds":')) {
      try {
        console.log("Attempting manual JSON construction from fragments...");
        const themeMatches = response.match(/"theme"\s*:\s*"([^"]+)"/g);
        const storyIdMatches = response.match(/"storyIds"\s*:\s*\[([\d\s,]+)\]/g);
        
        if (themeMatches && storyIdMatches && themeMatches.length === storyIdMatches.length) {
          const manualJson = [];
          
          for (let i = 0; i < themeMatches.length; i++) {
            const themeMatch = themeMatches[i].match(/"theme"\s*:\s*"([^"]+)"/);
            const storyIdMatch = storyIdMatches[i].match(/"storyIds"\s*:\s*\[([\d\s,]+)\]/);
            
            if (themeMatch && storyIdMatch) {
              const theme = themeMatch[1];
              const storyIdsStr = storyIdMatch[1];
              const storyIds = storyIdsStr.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
              
              manualJson.push({
                theme,
                storyIds
              });
            }
          }
          
          if (manualJson.length > 0) {
            console.log("Manual JSON construction succeeded:", manualJson);
            return manualJson;
          }
        }
      } catch (e) {
        console.log("Manual JSON construction failed:", e);
      }
    }
    
    console.error("All JSON extraction methods failed for response:", response);
    return null;
  } catch (err) {
    console.error("Error in JSON extraction:", err, "Response:", response);
    return null;
  }
};
