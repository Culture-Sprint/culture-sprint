
import { STORAGE_KEYS, LEGACY_KEYS } from './constants/storageKeys';
import { SliderQuestion } from './types/designTypes';
import { getStorageItem, setStorageItem, markFormAsDesigned } from './utils/storageUtils';

// Default slider questions to use when nothing is saved
const DEFAULT_SLIDER_QUESTIONS: SliderQuestion[] = [
  {
    id: 1,
    theme: "Impact",
    question: "How significant was this experience to you?",
    leftLabel: "Not significant",
    rightLabel: "Very significant",
    sliderValue: 5
  },
  {
    id: 2,
    theme: "Emotion",
    question: "How did this experience make you feel?",
    leftLabel: "Very negative",
    rightLabel: "Very positive",
    sliderValue: 5
  }
];

// Get the slider questions - always returns an array of slider questions
export const getSliderQuestions = (): SliderQuestion[] => {
  // First check the current storage location
  let savedThemes = getStorageItem<SliderQuestion[] | null>(STORAGE_KEYS.SLIDER_THEMES, null);
  
  // If nothing found, check legacy location
  if (!savedThemes) {
    const legacyThemes = getStorageItem<SliderQuestion[] | null>(LEGACY_KEYS.SLIDER_THEMES, null);
    
    if (legacyThemes && Array.isArray(legacyThemes) && legacyThemes.length > 0) {
      console.log("Found slider themes in legacy storage location, migrating");
      // Migrate to new storage key
      saveSliderQuestions(legacyThemes);
      return legacyThemes;
    }
    
    console.log("No slider themes found in localStorage, using defaults");
    return DEFAULT_SLIDER_QUESTIONS;
  }
  
  // Validate the data we got
  if (!Array.isArray(savedThemes) || savedThemes.length === 0) {
    console.log("Invalid or empty slider themes, using defaults");
    return DEFAULT_SLIDER_QUESTIONS;
  }
  
  console.log("Retrieved slider questions:", savedThemes);
  return savedThemes;
};

// Helper function to save slider questions
export const saveSliderQuestions = (questions: SliderQuestion[], projectId?: string): void => {
  setStorageItem(STORAGE_KEYS.SLIDER_THEMES, questions);
  // Also save to old location for backward compatibility
  setStorageItem(LEGACY_KEYS.SLIDER_THEMES, questions);
  
  // Use projectId if provided, otherwise use empty string
  markFormAsDesigned(projectId || '');
  
  console.log("Saved slider questions:", questions, "for project:", projectId || 'global');
};
