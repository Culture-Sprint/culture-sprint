
import { fetchActivityResponse, saveActivityResponse, isAuthenticated } from './operations';
import { ParticipantQuestion } from '../types/designTypes';

// Helper function to clean participant questions
const cleanParticipantQuestion = (q: ParticipantQuestion): ParticipantQuestion => {
  return {
    id: q.id,
    label: typeof q.label === 'string' ? q.label.trim() : "",
    checked: q.checked !== undefined ? !!q.checked : false,
    choices: Array.isArray(q.choices) 
      ? q.choices.map(c => ({
          id: c.id,
          label: typeof c.label === 'string' ? c.label.trim() : ""
        }))
      : []
  };
};

// Sync participant questions with Supabase
export const syncParticipantQuestionsFromSupabase = async (
  projectId: string,
  localQuestions: ParticipantQuestion[]
): Promise<ParticipantQuestion[]> => {
  if (!projectId) {
    return localQuestions;
  }
  
  console.log(`DEBUG: Attempting to fetch participant questions from Supabase for project: ${projectId}`);
  console.log(`DEBUG: Local participant questions count:`, localQuestions.length);
  
  try {
    // Check if the user is authenticated
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      console.log("DEBUG: User not authenticated for participant questions, using local questions");
      return localQuestions;
    }
    
    console.log(`DEBUG: User authenticated, fetching participant questions`);
    
    // Try all possible locations where participant questions might be stored
    const locations = [
      // Primary location (newer storage format)
      { phase: 'collection', step: 'questions', activity: 'participant-questions', key: 'participantQuestions' },
      // Alternate location (older format)
      { phase: 'collection', step: 'questions', activity: 'participant-questions', key: null },
      // Legacy location
      { phase: 'collection', step: 'public-form', activity: 'participant-questions', key: 'participantQuestions' }
    ];
    
    // Try each location until we find valid data
    for (const location of locations) {
      console.log(`DEBUG: Trying to fetch participant questions from ${location.phase}/${location.step}/${location.activity}`);
      
      const supabaseResponse = await fetchActivityResponse<any>(
        projectId,
        location.phase,
        location.step,
        location.activity,
        null,
        location.key
      );
      
      let participantQuestions: ParticipantQuestion[] = [];
      
      // Handle different response formats
      if (supabaseResponse) {
        if (Array.isArray(supabaseResponse)) {
          console.log(`DEBUG: Found direct array of ${supabaseResponse.length} participant questions`);
          participantQuestions = supabaseResponse;
        } else if (typeof supabaseResponse === 'object' && supabaseResponse !== null) {
          if (Array.isArray(supabaseResponse.participantQuestions)) {
            console.log(`DEBUG: Found participantQuestions array with ${supabaseResponse.participantQuestions.length} items`);
            participantQuestions = supabaseResponse.participantQuestions;
          } else {
            console.log(`DEBUG: Found object structure: ${Object.keys(supabaseResponse).join(', ')}`);
          }
        }
      }
      
      // If we found questions, clean and return them
      if (Array.isArray(participantQuestions) && participantQuestions.length > 0) {
        console.log(`DEBUG: Returning ${participantQuestions.length} participant questions from Supabase`);
        
        // Clean questions before returning
        const cleanedQuestions = participantQuestions.map(cleanParticipantQuestion);
        console.log(`DEBUG: First question: ${cleanedQuestions[0]?.label?.substring(0, 30)}...`);
        
        return cleanedQuestions;
      }
    }
    
    // If we get here, we couldn't find any questions in any location
    console.log("DEBUG: No participant questions found in any Supabase location, using local questions");
    return localQuestions;
  } catch (error) {
    console.error("Error in syncParticipantQuestionsFromSupabase:", error);
    return localQuestions;
  }
};

// Save participant questions to Supabase
export const saveParticipantQuestionsToSupabase = async (
  projectId: string,
  questions: ParticipantQuestion[]
): Promise<boolean> => {
  if (!projectId) {
    console.log("No project ID provided, not saving participant questions to Supabase");
    return false;
  }
  
  console.log(`DEBUG: Saving ${questions.length} participant questions to Supabase for project: ${projectId}`);
  
  try {
    // Check if the user is authenticated
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      console.log("DEBUG: User not authenticated, not saving participant questions to Supabase");
      return false;
    }
    
    // Clean the questions before saving
    const cleanedQuestions = questions.map(cleanParticipantQuestion);
    
    // Save to primary location (newer format)
    const primaryResult = await saveActivityResponse<{participantQuestions: ParticipantQuestion[]}>(
      projectId,
      'collection',
      'questions',
      'participant-questions',
      {participantQuestions: cleanedQuestions},
      null
    );
    
    // Also save to alternate location (direct array format)
    const alternateResult = await saveActivityResponse<ParticipantQuestion[]>(
      projectId,
      'collection',
      'questions',
      'participant-questions',
      cleanedQuestions,
      null
    );
    
    // For backward compatibility, also save to public-form location
    const compatResult = await saveActivityResponse<{participantQuestions: ParticipantQuestion[]}>(
      projectId,
      'collection',
      'public-form',
      'participant-questions',
      {participantQuestions: cleanedQuestions},
      null
    );
    
    console.log("DEBUG: Participant questions save results:", {
      primaryFormat: primaryResult,
      alternateFormat: alternateResult,
      compatibility: compatResult
    });
    
    return primaryResult || alternateResult || compatResult;
  } catch (error) {
    console.error("Error in saveParticipantQuestionsToSupabase:", error);
    return false;
  }
};
