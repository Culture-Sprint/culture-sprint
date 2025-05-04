
import { generateCacheKey, getCachedResponse, setCachedResponse } from "../../cache/responseCache";

/**
 * Try to get activity response from cache
 */
export const getCachedActivityResponse = async <T>(
  projectId: string,
  phaseId: string,
  normalizedPhaseId: string,
  stepId: string,
  activityId: string,
  responseKey: string | null,
  forceRefresh: boolean
): Promise<T | null> => {
  if (forceRefresh) {
    console.log(`Force refresh requested for ${activityId}, bypassing cache`);
    return null;
  }
  
  // Generate cache key for original phaseId
  const originalCacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
  
  // First check if we have cached data with original phaseId
  const cachedData = getCachedResponse<T>(originalCacheKey, responseKey);
  
  if (cachedData) {
    console.log(`Using cached data for ${activityId} with original phase ${phaseId}`);
    return cachedData;
  }
  
  // If normalized phaseId is different, also check that cache
  if (phaseId !== normalizedPhaseId) {
    const normalizedCacheKey = generateCacheKey(projectId, normalizedPhaseId, stepId, activityId);
    const normalizedCachedData = getCachedResponse<T>(normalizedCacheKey, responseKey);
    
    if (normalizedCachedData) {
      console.log(`Using cached data for ${activityId} with normalized phase ${normalizedPhaseId}`);
      // Also cache it with the original key for future use
      setCachedResponse(originalCacheKey, normalizedCachedData);
      return normalizedCachedData;
    }
  }
  
  return null;
};

/**
 * Cache response with both original and normalized keys
 */
export const cacheActivityResponse = <T>(
  projectId: string,
  phaseId: string,
  normalizedPhaseId: string,
  stepId: string,
  activityId: string,
  response: T
): void => {
  const originalCacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
  setCachedResponse(originalCacheKey, response);
  
  if (phaseId !== normalizedPhaseId) {
    const normalizedCacheKey = generateCacheKey(projectId, normalizedPhaseId, stepId, activityId);
    setCachedResponse(normalizedCacheKey, response);
  }
};
