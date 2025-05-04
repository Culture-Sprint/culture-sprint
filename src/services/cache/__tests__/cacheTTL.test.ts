
import { BaseCacheManager } from '../managers/baseCacheManager';
import { CACHE_EXPIRATION } from '../cacheConfig';

describe('Cache TTL', () => {
  let cacheManager: BaseCacheManager;
  
  beforeEach(() => {
    cacheManager = new BaseCacheManager();
    sessionStorage.clear();
    localStorage.clear();
  });
  
  test('should respect custom TTL', () => {
    const testKey = 'ttl_test';
    const testData = { value: 'test' };
    const shortTTL = 1000; // 1 second
    
    // Set with custom TTL
    cacheManager.set(testKey, testData, { ttl: shortTTL });
    
    // Should be valid immediately
    expect(cacheManager.get(testKey, null)).toEqual(testData);
    
    // Set expired timestamp
    const expiredTime = Date.now() - (shortTTL + 100);
    sessionStorage.setItem(`${testKey}_timestamp`, expiredTime.toString());
    
    // Should return null after TTL expired
    expect(cacheManager.get(testKey, null)).toBeNull();
  });
  
  test('should use default TTL when not specified', () => {
    const testKey = 'default_ttl';
    const testData = { value: 'test' };
    
    // Set without TTL
    cacheManager.set(testKey, testData);
    
    // Should use MEDIUM expiration by default
    const expiredTime = Date.now() - (CACHE_EXPIRATION.MEDIUM + 100);
    sessionStorage.setItem(`${testKey}_timestamp`, expiredTime.toString());
    
    expect(cacheManager.get(testKey, null)).toBeNull();
  });
  
  test('should allow infinite TTL', () => {
    const testKey = 'infinite_ttl';
    const testData = { value: 'test' };
    
    // Set with infinite TTL
    cacheManager.set(testKey, testData, { ttl: -1 });
    
    // Set a very old timestamp
    const veryOldTime = Date.now() - (365 * 24 * 60 * 60 * 1000); // 1 year ago
    sessionStorage.setItem(`${testKey}_timestamp`, veryOldTime.toString());
    
    // Should still be valid
    expect(cacheManager.get(testKey, null)).toEqual(testData);
  });
});

