
/**
 * Memory cache implementation
 */
import { memoryCache } from './cacheConfig';

/**
 * Get an item from memory cache
 */
export const getFromMemoryCache = <T>(
  key: string,
  defaultValue: T,
  expiration: number = -1
): T => {
  const item = memoryCache.get(key);
  if (item && (expiration === -1 || Date.now() - item.timestamp < expiration)) {
    return item.data as T;
  }
  return defaultValue;
};

/**
 * Set an item in memory cache
 */
export const setInMemoryCache = <T>(
  key: string, 
  data: T,
  ttl?: number
): void => {
  memoryCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Remove an item from memory cache
 */
export const removeFromMemoryCache = (key: string): void => {
  memoryCache.delete(key);
};

/**
 * Clear items from memory cache by pattern
 */
export const clearMemoryCacheByPattern = (pattern: string): void => {
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
};

/**
 * Check if an item in memory cache is valid
 */
export const isMemoryCacheItemValid = (key: string, expiration: number): boolean => {
  const item = memoryCache.get(key);
  return !!item && (Date.now() - item.timestamp < expiration);
};
