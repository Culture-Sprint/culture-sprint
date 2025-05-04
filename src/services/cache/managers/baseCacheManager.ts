
import { CacheOptions, CacheManager } from '../types/cacheTypes';
import { getCachedItem, setCachedItem, removeCachedItem, clearCacheByPattern, isValid } from '../cacheService';
import { CACHE_EXPIRATION } from '../cacheConfig';

/**
 * Base cache manager implementation
 */
export class BaseCacheManager implements CacheManager {
  /**
   * Retrieve an item from cache
   */
  get<T>(key: string, defaultValue: T, options: CacheOptions = {}): T {
    console.group(`🔍 [BaseCacheManager] get(${key})`);
    try {
      const data = getCachedItem<T>(key, defaultValue, options);
      console.log(`${data === defaultValue ? '❌ Cache MISS' : '✅ Cache HIT'}`);
      return data;
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Store an item in cache
   */
  set<T>(key: string, data: T, options: CacheOptions = {}): void {
    console.log(`💾 [BaseCacheManager] set(${key})`);
    setCachedItem<T>(key, data, options);
  }

  /**
   * Remove an item from cache
   */
  remove(key: string, options: CacheOptions = {}): void {
    console.log(`🗑️ [BaseCacheManager] remove(${key})`);
    removeCachedItem(key, options);
  }

  /**
   * Clear all cache items matching a pattern
   */
  clearPattern(pattern: string, options: CacheOptions = {}): void {
    console.log(`🗑️ [BaseCacheManager] clearPattern(${pattern})`);
    clearCacheByPattern(pattern, options);
  }
  
  /**
   * Check if an item should be loaded from remote
   */
  shouldLoadFromRemote(key: string, options: CacheOptions = {}): boolean {
    const valid = this.isValid(key, options);
    console.log(`🔄 [BaseCacheManager] shouldLoadFromRemote(${key}) = ${!valid}`);
    return !valid;
  }
  
  /**
   * Check if a cached item is valid (not expired)
   */
  isValid(key: string, options: CacheOptions = {}): boolean {
    const ttl = options.ttl || options.expiration || CACHE_EXPIRATION.MEDIUM;
    const valid = isValid(key, { ...options, ttl });
    console.log(`🔍 [BaseCacheManager] isValid(${key}, ttl: ${ttl}) = ${valid}`);
    return valid;
  }
}
