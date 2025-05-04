
import { SliderQuestion } from '@/services/types/designTypes';
import { fetchActivityResponse, saveActivityResponse, isAuthenticated } from '../operations';
import { clearActivityCache } from '../core/cacheUtils';

// Define our canonical storage location
export const CANONICAL_SLIDER_LOCATION = {
  phase: 'collection',
  step: 'questions',
  activity: 'slider-questions'
};

// Define secondary location for public form
export const PUBLIC_FORM_SLIDER_LOCATION = {
  phase: 'collection',
  step: 'public-form',
  activity: 'slider-questions'
};

// Define the type for legacy locations to ensure all have a key property
interface LegacyLocation {
  phase: string;
  step: string;
  activity: string;
  key: string;
}

// Define all possible locations where slider questions might be stored
export const LEGACY_SLIDER_LOCATIONS: LegacyLocation[] = [
  { phase: 'design', step: 'form-questions', activity: 'slider-questions', key: 'sliderQuestions' },
  { phase: PUBLIC_FORM_SLIDER_LOCATION.phase, step: PUBLIC_FORM_SLIDER_LOCATION.step, activity: PUBLIC_FORM_SLIDER_LOCATION.activity, key: 'sliderQuestions' },
  { phase: 'collection', step: 'public-form', activity: 'form-config', key: 'sliderQuestions' }
];

/**
 * Clean and validate a slider question
 */
export const cleanSliderQuestion = (question: SliderQuestion): SliderQuestion => {
  return {
    id: question.id || Math.random(),
    theme: question.theme || 'General',
    question: typeof question.question === 'string' 
      ? question.question.trim().replace(/\s+/g, ' ').replace(/\.(.*?)\./, ". ").replace(/(\.+ )/g, '. ')
      : `Question ${question.id}`,
    leftLabel: typeof question.leftLabel === 'string' ? question.leftLabel.trim() : 'Not at all',
    rightLabel: typeof question.rightLabel === 'string' ? question.rightLabel.trim() : 'Very much',
    sliderValue: Number(question.sliderValue || 50)
  };
};

/**
 * Migrates slider questions data from all possible locations to the canonical location
 */
export const migrateSliderQuestions = async (projectId: string): Promise<SliderQuestion[]> => {
  if (!projectId) {
    console.log("No project ID provided, migration skipped");
    return [];
  }
  
  console.log(`Starting slider questions migration for project: ${projectId}`);
  
  try {
    // Check if the user is authenticated
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      console.log("User not authenticated, migration skipped");
      return [];
    }
    
    // First check if we already have data in the canonical location
    console.log("Checking canonical location for existing data");
    const canonicalData = await fetchActivityResponse<{sliderQuestions: SliderQuestion[]}>(
      projectId,
      CANONICAL_SLIDER_LOCATION.phase,
      CANONICAL_SLIDER_LOCATION.step,
      CANONICAL_SLIDER_LOCATION.activity,
      null,
      'sliderQuestions'
    );
    
    if (canonicalData && Array.isArray(canonicalData.sliderQuestions) && canonicalData.sliderQuestions.length > 0) {
      console.log("Data already exists in canonical location, no migration needed");
      return canonicalData.sliderQuestions.map(cleanSliderQuestion);
    }
    
    // If no canonical data, check all legacy locations
    console.log("Checking all legacy locations for data");
    
    let mostRecentQuestions: SliderQuestion[] = [];
    
    // Check each location in order
    for (const location of LEGACY_SLIDER_LOCATIONS) {
      console.log(`Checking ${location.phase}/${location.step}/${location.activity}`);
      
      const locationData = await fetchActivityResponse<any>(
        projectId,
        location.phase,
        location.step,
        location.activity,
        null,
        location.key
      );
      
      let questionsFromLocation: SliderQuestion[] = [];
      
      if (locationData) {
        if (Array.isArray(locationData)) {
          console.log(`Found array with ${locationData.length} questions`);
          questionsFromLocation = locationData;
        } else if (typeof locationData === 'object' && locationData !== null) {
          if (Array.isArray(locationData.sliderQuestions)) {
            console.log(`Found sliderQuestions array with ${locationData.sliderQuestions.length} items`);
            questionsFromLocation = locationData.sliderQuestions;
          }
        }
      }
      
      if (questionsFromLocation.length > 0) {
        console.log(`Found ${questionsFromLocation.length} questions in ${location.phase}/${location.step}/${location.activity}`);
        
        // If we find questions, use them and continue checking other locations
        if (questionsFromLocation.length > mostRecentQuestions.length) {
          mostRecentQuestions = questionsFromLocation;
        }
      }
    }
    
    // If we found questions, migrate them to the canonical location
    if (mostRecentQuestions.length > 0) {
      console.log(`Migrating ${mostRecentQuestions.length} questions to canonical location`);
      
      // Clean the questions
      const cleanedQuestions = mostRecentQuestions.map(cleanSliderQuestion);
      
      // Save to canonical location
      await saveActivityResponse(
        projectId,
        CANONICAL_SLIDER_LOCATION.phase,
        CANONICAL_SLIDER_LOCATION.step,
        CANONICAL_SLIDER_LOCATION.activity,
        { sliderQuestions: cleanedQuestions }
      );
      
      // Also save to public form location for future use
      await saveActivityResponse(
        projectId,
        PUBLIC_FORM_SLIDER_LOCATION.phase,
        PUBLIC_FORM_SLIDER_LOCATION.step,
        PUBLIC_FORM_SLIDER_LOCATION.activity,
        { sliderQuestions: cleanedQuestions }
      );
      
      console.log("Migration completed successfully");
      return cleanedQuestions;
    }
    
    console.log("No slider questions found in any location");
    return [];
  } catch (error) {
    console.error("Error during slider questions migration:", error);
    return [];
  }
};
