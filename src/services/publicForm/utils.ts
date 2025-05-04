
import { SliderQuestion, ParticipantQuestion } from "../types/designTypes";
import { isPlainObject } from "./types";

/**
 * Extracts the story question from various response formats
 */
export const extractStoryQuestion = (response: any): string | null => {
  try {
    // Handle string directly
    if (typeof response === 'string') {
      return response.trim();
    }
    
    // Handle object with question property
    if (isPlainObject(response) && typeof response.question === 'string') {
      return response.question.trim();
    }
    
    // Handle object with storyQuestion property
    if (isPlainObject(response) && typeof response.storyQuestion === 'string') {
      return response.storyQuestion.trim();
    }
    
    // Handle nested structure
    if (isPlainObject(response) && isPlainObject(response.data) && typeof response.data.question === 'string') {
      return response.data.question.trim();
    }
    
    console.log("No recognized story question format found");
    return null;
  } catch (error) {
    console.error("Error extracting story question:", error);
    return null;
  }
};

/**
 * Cleans and standardizes a slider question
 */
export const cleanSliderQuestion = (question: SliderQuestion): SliderQuestion => {
  return {
    id: question.id,
    theme: question.theme || "", // Add theme with default empty string
    question: typeof question.question === 'string' ? question.question.trim() : "",
    leftLabel: typeof question.leftLabel === 'string' ? question.leftLabel.trim() : "Not at all",
    rightLabel: typeof question.rightLabel === 'string' ? question.rightLabel.trim() : "Very much",
    sliderValue: typeof question.sliderValue === 'number' ? question.sliderValue : 50
  };
};

/**
 * Extracts slider questions from various response formats
 */
export const extractSliderQuestions = (response: any): SliderQuestion[] | null => {
  try {
    // Handle direct array of slider questions
    if (Array.isArray(response)) {
      console.log("Found direct array of slider questions");
      return response.filter(item => item && typeof item === 'object')
        .map(cleanSliderQuestion);
    }

    // Handle nested sliderQuestions array
    if (isPlainObject(response) && response.sliderQuestions && Array.isArray(response.sliderQuestions)) {
      console.log("Found nested sliderQuestions array");
      return response.sliderQuestions.filter(item => item && typeof item === 'object')
        .map(cleanSliderQuestion);
    }

    // Handle questions property if present
    if (isPlainObject(response) && response.questions && Array.isArray(response.questions)) {
      console.log("Found questions array");
      return response.questions.filter(item => item && typeof item === 'object')
        .map(cleanSliderQuestion);
    }

    console.log("No recognized slider questions format found");
    return null;
  } catch (error) {
    console.error("Error extracting slider questions:", error);
    return null;
  }
};

/**
 * Extracts participant questions from various response formats
 */
export const extractParticipantQuestions = (response: any): ParticipantQuestion[] | null => {
  try {
    // Handle direct array of participant questions
    if (Array.isArray(response)) {
      console.log("Found direct array of participant questions");
      return response.filter(item => item && typeof item === 'object');
    }
    
    // Handle nested participantQuestions array
    if (isPlainObject(response) && response.participantQuestions && Array.isArray(response.participantQuestions)) {
      console.log("Found nested participantQuestions array");
      return response.participantQuestions.filter(item => item && typeof item === 'object');
    }
    
    // Handle questions property if present
    if (isPlainObject(response) && response.questions && Array.isArray(response.questions)) {
      console.log("Found questions array for participants");
      return response.questions.filter(item => item && typeof item === 'object');
    }
    
    console.log("No recognized participant questions format found");
    return null;
  } catch (error) {
    console.error("Error extracting participant questions:", error);
    return null;
  }
};
