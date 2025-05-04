
import { CacheOptions } from '../types/cacheTypes';
import { BaseCacheManager } from './baseCacheManager';
import { cacheKeys } from '../cacheKeyGenerator';

/**
 * Specialized cache manager for activity data
 */
export class ActivityCacheManager extends BaseCacheManager {
  /**
   * Get activity data
   */
  getActivity<T>(projectId: string, activityId: string, defaultValue: T = null as unknown as T, options: CacheOptions = {}): T {
    const key = cacheKeys.activity(projectId, activityId);
    return super.get<T>(key, defaultValue, options);
  }

  /**
   * Store activity data
   */
  setActivity<T>(projectId: string, activityId: string, data: T, options: CacheOptions = {}): void {
    const key = cacheKeys.activity(projectId, activityId);
    super.set<T>(key, data, options);
  }

  /**
   * Remove activity data
   */
  removeActivity(projectId: string, activityId: string, options: CacheOptions = {}): void {
    const key = cacheKeys.activity(projectId, activityId);
    super.remove(key, options);
  }

  /**
   * Clear all activity data for a project
   */
  clearProjectActivities(projectId: string, options: CacheOptions = {}): void {
    const pattern = `activity_${projectId}_*`;
    super.clearPattern(pattern, options);
  }
  
  /**
   * Clear all activity data for a project (alias for clearProjectActivities)
   * Added for compatibility with tests
   */
  clearAll(projectId: string, options: CacheOptions = {}): void {
    this.clearProjectActivities(projectId, options);
  }

  // Implement inherited methods to maintain interface compatibility
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
