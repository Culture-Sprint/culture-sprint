
import { CacheOptions } from '../types/cacheTypes';
import { BaseCacheManager } from './baseCacheManager';
import { cacheKeys } from '../cacheKeyGenerator';

/**
 * Specialized cache manager for context data
 */
export class ContextCacheManager extends BaseCacheManager {
  /**
   * Get context data
   */
  getContext<T>(projectId: string, defaultValue: T = null as unknown as T, options: CacheOptions = {}): T {
    const key = cacheKeys.context(projectId);
    return super.get<T>(key, defaultValue, options);
  }

  /**
   * Store context data
   */
  setContext<T>(projectId: string, data: T, options: CacheOptions = {}): void {
    const key = cacheKeys.context(projectId);
    super.set<T>(key, data, options);
  }

  /**
   * Remove context data
   */
  removeContext(projectId: string, options: CacheOptions = {}): void {
    const key = cacheKeys.context(projectId);
    super.remove(key, options);
  }

  /**
   * Clear all context data
   */
  clearAllContexts(options: CacheOptions = {}): void {
    const pattern = 'context_*';
    super.clearPattern(pattern, options);
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
