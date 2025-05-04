
import { BaseCacheManager } from '../managers/baseCacheManager';
import { CACHE_EXPIRATION } from '../cacheConfig';

describe('Cache Expiration', () => {
  let cacheManager: BaseCacheManager;
  
  beforeEach(() => {
    cacheManager = new BaseCacheManager();
    sessionStorage.clear();
  });
  
  test('should respect cache expiration time', () => {
    const testKey = 'expiration_test';
    const testData = 'test data';
    
    // Set data with short expiration
    cacheManager.set(testKey, testData);
    
    // Set expired timestamp (1 hour ago)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    sessionStorage.setItem(`${testKey}_timestamp`, oneHourAgo.toString());
    
    // Check if should load from remote
    expect(cacheManager.shouldLoadFromRemote(testKey, {
      ttl: CACHE_EXPIRATION.SHORT
    })).toBe(true);
  });
  
  test('should not expire fresh cache', () => {
    const testKey = 'fresh_cache';
    const testData = 'fresh data';
    
    // Set data with medium expiration
    cacheManager.set(testKey, testData);
    
    // Should not need to load from remote yet
    expect(cacheManager.shouldLoadFromRemote(testKey, {
      ttl: CACHE_EXPIRATION.MEDIUM
    })).toBe(false);
  });
  
  test('should handle different expiration times', () => {
    const testKey = 'expiration_times';
    const testData = 'test data';
    
    cacheManager.set(testKey, testData);
    
    // Set timestamp to 2 minutes ago
    const twoMinutesAgo = Date.now() - (2 * 60 * 1000);
    sessionStorage.setItem(`${testKey}_timestamp`, twoMinutesAgo.toString());
    
    // Should be expired for SHORT but not for MEDIUM
    expect(cacheManager.shouldLoadFromRemote(testKey, {
      ttl: CACHE_EXPIRATION.SHORT
    })).toBe(true);
    
    expect(cacheManager.shouldLoadFromRemote(testKey, {
      ttl: CACHE_EXPIRATION.MEDIUM
    })).toBe(false);
  });
});
