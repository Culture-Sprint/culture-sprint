import { isAuthenticated } from './core/authUtils';

/**
 * Base functionality for syncing slider questions data between localStorage and Supabase
 */
export const syncSliderQuestionsFromSupabase = async <T>(
  projectId: string | undefined,
  localData: T,
  syncFunction: (projectId: string, localData: T) => Promise<T>,
  saveLocalFunction: (data: T) => void
): Promise<T> => {
  // If no projectId, just return local data
  if (!projectId) {
    return localData;
  }
  
  try {
    // Check if authenticated before trying to sync
    if (!(await isAuthenticated())) {
      console.log('User not authenticated, using local slider questions data');
      return localData;
    }
    
    // Try to get from Supabase
    const supabaseData = await syncFunction(projectId, localData);
    
    if (JSON.stringify(supabaseData) !== JSON.stringify(localData)) {
      console.log('Syncing slider questions data from Supabase to localStorage');
      saveLocalFunction(supabaseData);
    } else if (localData) {
      console.log('Local slider questions data matches Supabase data');
    }
    
    return supabaseData || localData;
  } catch (error) {
    console.error('Error syncing slider questions with Supabase:', error);
  }
  
  // Return local data as fallback
  return localData;
};

export const saveSliderQuestionsToSupabase = async <T>(
  projectId: string | undefined,
  data: T,
  saveLocalFunction: (data: T) => void,
  saveSupabaseFunction: (projectId: string, data: T) => Promise<boolean>
): Promise<boolean> => {
  try {
    // Save to localStorage
    saveLocalFunction(data);
    
    // If no projectId or not authenticated, just return after local save
    if (!projectId) {
      return true;
    }
    
    // Save to Supabase if authenticated
    if (await isAuthenticated()) {
      await saveSupabaseFunction(projectId, data);
      console.log('Slider questions data saved to Supabase');
      return true;
    } else {
      console.log('User not authenticated, slider questions data saved to localStorage only');
      return true;
    }
  } catch (error) {
    console.error('Error saving slider questions data:', error);
    return false;
  }
};
