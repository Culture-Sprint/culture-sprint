
import { CacheOptions } from '../types/cacheTypes';
import { BaseCacheManager } from './baseCacheManager';
import { cacheKeys } from '../cacheKeyGenerator';

/**
 * Specialized cache manager for activity response data
 */
export class ResponseCacheManager extends BaseCacheManager {
  /**
   * Get a cached response
   */
  getResponse<T>(projectId: string, activityId: string, defaultValue: T = null as unknown as T, options: CacheOptions = {}): T {
    const key = cacheKeys.activity(projectId, activityId);
    return super.get<T>(key, defaultValue, options);
  }

  /**
   * Set a response in cache
   */
  setResponse<T>(projectId: string, activityId: string, data: T, options: CacheOptions = {}): void {
    const key = cacheKeys.activity(projectId, activityId);
    super.set<T>(key, data, options);
  }

  /**
   * Remove a response from cache
   */
  removeResponse(projectId: string, activityId: string, options: CacheOptions = {}): void {
    const key = cacheKeys.activity(projectId, activityId);
    super.remove(key, options);
  }

  /**
   * Generate a standard response cache key
   */
  generateResponseKey(projectId: string, phaseId: string, stepId: string, activityId: string): string {
    return `response_${projectId}_${phaseId}_${stepId}_${activityId}`;
  }

  /**
   * Get a response using the full path key
   */
  getResponseByPath<T>(projectId: string, phaseId: string, stepId: string, activityId: string, defaultValue: T = null as unknown as T, options: CacheOptions = {}): T {
    const key = this.generateResponseKey(projectId, phaseId, stepId, activityId);
    return super.get<T>(key, defaultValue, options);
  }

  /**
   * Set a response using the full path key
   */
  setResponseByPath<T>(projectId: string, phaseId: string, stepId: string, activityId: string, data: T, options: CacheOptions = {}): void {
    const key = this.generateResponseKey(projectId, phaseId, stepId, activityId);
    super.set<T>(key, data, options);
  }

  /**
   * Clear all responses for a project
   */
  clearProjectResponses(projectId: string, options: CacheOptions = {}): void {
    const pattern = `response_${projectId}_*`;
    super.clearPattern(pattern, options);
  }

  // Implement base class methods to maintain interface compatibility
  get<T>(key: string, defaultValue: T, options?: CacheOptions): T {
    return super.get(key, defaultValue, options);
  }

  set<T>(key: string, data: T, options?: CacheOptions): void {
    super.set(key, data, options);
  }

  remove(key: string, options?: CacheOptions): void {
    super.remove(key, options);
  }
}
