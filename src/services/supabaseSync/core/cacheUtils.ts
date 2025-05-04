
import { clearAllCachedResponses, clearActivityCache as clearSingleActivityCache } from "@/services/cache/activityResponseCache";

/**
 * Utility to clear all activity response cache entries
 */
export const clearActivityResponseCache = (): void => {
  clearAllCachedResponses();
  console.log('Activity response cache cleared');
};

/**
 * Clear the cache for a specific activity
 */
export const clearActivityCache = (
  projectId: string,
  phaseId: string,
  stepId: string,
  activityId: string
): void => {
  clearSingleActivityCache(projectId, phaseId, stepId, activityId);
  console.log(`Cache cleared for ${activityId}`);
};
