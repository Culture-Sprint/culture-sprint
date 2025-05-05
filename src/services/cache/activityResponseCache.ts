import { cacheManager } from './cacheManager';
import { CacheOptions } from './types/cacheTypes';
import { CACHE_EXPIRATION } from './cacheConfig';

/**
 * Generate standardized cache key for activity responses
 */
export const generateCacheKey = (
  projectId: string, 
  phaseId: string, 
  stepId: string, 
  activityId: string
): string => {
  return cacheManager.response.generateResponseKey(projectId, phaseId, stepId, activityId);
};

/**
 * Get cached response data
 */
export const getCachedResponse = <T>(
  cacheKey: string,
  responseKey: string | null = null,
  options: CacheOptions = { ttl: CACHE_EXPIRATION.MEDIUM }
): T | null => {
  try {
    const cachedData = cacheManager.get<T>(cacheKey, null as unknown as T, options);
    
    if (!cachedData) {
      return null;
    }
    
    // Extract specific key if requested
    if (responseKey && typeof cachedData === 'object' && cachedData !== null && responseKey in (cachedData as object)) {
      return (cachedData as any)[responseKey];
    }
    
    return cachedData;
  } catch (error) {
    console.error("Error retrieving cached response for key:", cacheKey, error);
    return null;
  }
};

/**
 * Set response data in cache
 */
export const setCachedResponse = <T>(
  cacheKey: string,
  data: T,
  options: CacheOptions = { ttl: CACHE_EXPIRATION.MEDIUM }
): void => {
  try {
    cacheManager.set(cacheKey, data, options);
  } catch (error) {
    console.error("Error caching response for key:", cacheKey, error);
  }
};

/**
 * Clear cached response
 */
export const clearCachedResponse = (
  cacheKey: string,
  options: CacheOptions = {}
): void => {
  try {
    cacheManager.remove(cacheKey, options);
  } catch (error) {
    console.error("Error clearing cached response for key:", cacheKey, error);
  }
};

/**
 * Clear all cached responses
 */
export const clearAllCachedResponses = (options: CacheOptions = {}): void => {
  try {
    cacheManager.clearPattern('response_*', options);
  } catch (error) {
    console.error("Error clearing all cached responses:", error);
  }
};

/**
 * Clear all cached responses for a specific project
 */
export const clearProjectCachedResponses = (
  projectId: string,
  options: CacheOptions = {}
): void => {
  try {
    cacheManager.response.clearProjectResponses(projectId, options);
  } catch (error) {
    console.error("Error clearing cached responses for project:", projectId, error);
  }
};

/**
 * Clear cache for a specific activity
 */
export const clearActivityCache = (
  projectId: string,
  phaseId: string,
  stepId: string,
  activityId: string
): void => {
  try {
    const cacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
    clearCachedResponse(cacheKey);
    console.log(`Cleared activity cache for key: ${cacheKey}`);
  } catch (error) {
    console.error("Error clearing activity cache:", error);
  }
};

// Export cache expiration constant for backward compatibility
export { CACHE_EXPIRATION };
