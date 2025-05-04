
import { STORAGE_KEYS, LEGACY_KEYS } from './constants/storageKeys';
import { ParticipantQuestion } from './types/designTypes';
import { getStorageItem, setStorageItem, markFormAsDesigned } from './utils/storageUtils';

// Get the participant questions for a specific project
export const getParticipantQuestions = (projectId?: string): ParticipantQuestion[] => {
  // Use project-specific storage key if available
  const storageKey = projectId 
    ? `${STORAGE_KEYS.PARTICIPANT_QUESTIONS}_${projectId}`
    : STORAGE_KEYS.PARTICIPANT_QUESTIONS;
  
  // First check the project-specific or global storage location
  let savedQuestions = getStorageItem<ParticipantQuestion[] | null>(storageKey, null);
  
  // If no project-specific questions found, check legacy location
  if (!savedQuestions) {
    // For backward compatibility, check the global questions
    if (projectId) {
      savedQuestions = getStorageItem<ParticipantQuestion[] | null>(STORAGE_KEYS.PARTICIPANT_QUESTIONS, null);
    }
    
    // If still not found, check legacy key
    if (!savedQuestions) {
      const legacyQuestions = getStorageItem<ParticipantQuestion[] | null>(LEGACY_KEYS.PARTICIPANT_QUESTIONS, null);
      
      if (legacyQuestions && Array.isArray(legacyQuestions)) {
        console.log("Found participant questions in legacy storage location, migrating");
        // Migrate to new storage key
        saveParticipantQuestions(legacyQuestions, projectId);
        return legacyQuestions;
      }
      
      console.log("No participant questions found in localStorage");
      return [];
    }
  }
  
  // Validate the data we got
  if (!Array.isArray(savedQuestions)) {
    console.log("Invalid participant questions format, returning empty array");
    return [];
  }
  
  // Filter out any questions that don't have the required properties
  const validQuestions = savedQuestions.filter(q => 
    q && typeof q === 'object' && 'id' in q && 'label' in q && 'choices' in q
  );
  
  console.log(`Retrieved participant questions for project: ${projectId || 'global'}:`, validQuestions);
  return validQuestions;
};

// Helper function to save participant questions
export const saveParticipantQuestions = (questions: ParticipantQuestion[], projectId?: string): void => {
  // Use project-specific storage key if available
  const storageKey = projectId 
    ? `${STORAGE_KEYS.PARTICIPANT_QUESTIONS}_${projectId}`
    : STORAGE_KEYS.PARTICIPANT_QUESTIONS;
  
  setStorageItem(storageKey, questions);
  
  // Also save to old location for backward compatibility if not project-specific
  if (!projectId) {
    setStorageItem(LEGACY_KEYS.PARTICIPANT_QUESTIONS, questions);
  }
  
  // Use projectId if provided, otherwise use undefined which will just mark the global flag
  markFormAsDesigned(projectId || '');
  
  console.log("Saved participant questions:", questions, "for project:", projectId || 'global');
};

// Export a renamed function for the hooks that need it
export const getParticipantQuestionsFromService = getParticipantQuestions;
