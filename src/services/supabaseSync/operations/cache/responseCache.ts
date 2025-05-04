
// Import from our centralized cache service
import { 
  generateCacheKey, 
  getCachedResponse, 
  setCachedResponse,
  clearCachedResponse,
  clearAllCachedResponses,
  clearProjectCachedResponses 
} from "@/services/cache/activityResponseCache";

// Clear cache for a specific activity
export const clearActivityCache = (
  projectId: string,
  phaseId: string,
  stepId: string,
  activityId: string
): void => {
  try {
    const cacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
    sessionStorage.removeItem(`ar_cache_${cacheKey}`);
    console.log(`Cleared activity cache for key: ${cacheKey}`);
  } catch (error) {
    console.error(`Error clearing activity cache:`, error);
  }
};

// Re-export everything from the centralized service
export {
  generateCacheKey,
  getCachedResponse,
  setCachedResponse,
  clearCachedResponse,
  clearAllCachedResponses,
  clearProjectCachedResponses
};

// Cache configuration (for backward compatibility)
const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutes cache expiration
export { CACHE_EXPIRATION };
