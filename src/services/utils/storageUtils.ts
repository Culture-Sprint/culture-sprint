
/**
 * Utility functions for working with browser storage
 */

/**
 * Get item from storage with default value fallback
 */
export const getStorageItem = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set item in storage with error handling
 */
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
  }
};

/**
 * Remove item from storage with error handling
 */
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

/**
 * Mark a form as designed for a project
 * @param projectId The project ID to mark form design for (empty string for global)
 */
export const markFormAsDesigned = (projectId: string): void => {
  try {
    // Set global flag
    localStorage.setItem('culturesprint_form_designed', 'true');
    
    // If a specific project ID is provided, also set project-specific flag
    if (projectId) {
      localStorage.setItem(`culturesprint_form_designed_${projectId}`, 'true');
      console.log(`Form marked as designed for project: ${projectId}`);
    } else {
      console.log('Form marked as designed globally');
    }
  } catch (error) {
    console.error('Error marking form as designed:', error);
  }
};

/**
 * Check if a form has been explicitly designed for a specific project
 * @param projectId The project ID to check form design status for
 */
export const isFormDesignedForProject = (projectId: string): boolean => {
  try {
    return localStorage.getItem(`culturesprint_form_designed_${projectId}`) === 'true';
  } catch (error) {
    console.error(`Error checking if form is designed for project ${projectId}:`, error);
    return false;
  }
};

/**
 * Clear all storage items related to a specific project
 * @param projectId The project ID to clear storage for
 */
export const clearProjectStorage = (projectId: string): void => {
  if (!projectId) {
    console.error("Cannot clear project storage: No project ID provided");
    return;
  }
  
  try {
    // Find all localStorage items that contain the project ID
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(projectId)) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all found keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Removed storage item: ${key}`);
    });
    
    console.log(`Cleared ${keysToRemove.length} storage items for project: ${projectId}`);
  } catch (error) {
    console.error(`Error clearing project storage for ${projectId}:`, error);
  }
};
