
/**
 * Formats a story response from the database into a standardized format for the UI
 */
export const formatStoryResponse = (
  story: any, 
  sliderResponses: any[] = [], 
  participantResponses: any[] = [],
  preClassifiedSentiment?: "positive" | "negative" | "neutral"
) => {
  // Debug the inputs
  console.log("formatStoryResponse - Raw story:", story);
  console.log("formatStoryResponse - Raw slider responses:", sliderResponses);
  console.log("formatStoryResponse - Raw participant responses:", participantResponses);
  
  // Construct the formatted story object
  const formattedStory = {
    id: story.id,
    title: story.title || "Untitled Story",
    text: story.text || "",
    feeling: story.emotional_response || "unspecified",
    feelingSentiment: preClassifiedSentiment, // Use pre-classified sentiment if available
    date: story.created_at,
    isPublic: story.is_public || false,
    isImported: story.is_imported || false,
    additional_comments: story.additional_comments || "",
    
    // Format and add slider responses
    sliderResponses: sliderResponses.map(response => ({
      id: response.id,
      question_id: response.question_id,
      question_text: response.question_text || "Unnamed Question",
      value: response.value,
      response_type: response.value === null ? "skipped" : "answered" as "skipped" | "answered",
      left_label: response.left_label || "",
      right_label: response.right_label || ""
    })),
    
    // Format and add participant responses
    participantResponses: participantResponses.map(response => ({
      id: response.id,
      question_id: response.question_id,
      question_text: response.question_text || "Unnamed Question",
      response: response.response || ""
    }))
  };
  
  console.log("formatStoryResponse - Formatted story:", formattedStory);
  return formattedStory;
};

// Get color for feeling badge
export const getFeelingColor = (feeling: string): string => {
  const lowerFeeling = feeling.toLowerCase();
  
  if (lowerFeeling.includes("happy") || lowerFeeling.includes("positive") || lowerFeeling.includes("good")) {
    return "bg-green-100 text-green-800 hover:bg-green-100";
  } else if (lowerFeeling.includes("sad") || lowerFeeling.includes("negative") || lowerFeeling.includes("bad")) {
    return "bg-red-100 text-red-800 hover:bg-red-100";
  } else if (lowerFeeling.includes("neutral")) {
    return "bg-blue-100 text-blue-800 hover:bg-blue-100";
  }
  
  // Default color
  return "bg-gray-100 text-gray-800 hover:bg-gray-100";
};

// Format date for display
export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Format date in short format
export const formatShortDate = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Check if the date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise, return a short date format
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (error) {
    console.error("Error formatting short date:", error);
    return dateString;
  }
};

// Format date in YYYY-MM-DD format for CSV export
export const formatDateYYYYMMDD = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date for CSV:", error);
    return dateString;
  }
};

// Format date as Month Day for story cards
export const formatMonthDay = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch (error) {
    console.error("Error formatting month day:", error);
    return dateString;
  }
};
