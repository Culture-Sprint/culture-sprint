
import { BaseCacheManager } from '../managers/baseCacheManager';

describe('BaseCacheManager', () => {
  let cacheManager: BaseCacheManager;
  
  beforeEach(() => {
    // Reset the manager and clear storage before each test
    cacheManager = new BaseCacheManager();
    sessionStorage.clear();
    localStorage.clear();
  });
  
  test('should set and get items from cache', () => {
    const testKey = 'test_key';
    const testData = { name: 'Test Data' };
    
    cacheManager.set(testKey, testData);
    const retrieved = cacheManager.get<typeof testData>(testKey, null);
    
    expect(retrieved).toEqual(testData);
  });
  
  test('should return default value when key does not exist', () => {
    const defaultValue = { default: true };
    const result = cacheManager.get('nonexistent_key', defaultValue);
    
    expect(result).toEqual(defaultValue);
  });
  
  test('should remove items from cache', () => {
    const testKey = 'test_remove';
    cacheManager.set(testKey, 'test data');
    
    expect(cacheManager.get(testKey, null)).toBe('test data');
    
    cacheManager.remove(testKey);
    expect(cacheManager.get(testKey, 'default')).toBe('default');
  });
  
  test('should clear items by pattern', () => {
    cacheManager.set('test_1', 'data1');
    cacheManager.set('test_2', 'data2');
    cacheManager.set('other', 'data3');
    
    cacheManager.clearPattern('test_');
    
    expect(cacheManager.get('test_1', null)).toBeNull();
    expect(cacheManager.get('test_2', null)).toBeNull();
    expect(cacheManager.get('other', null)).toBe('data3');
  });
  
  test('should handle storage type option', () => {
    const testKey = 'storage_test';
    const testData = 'test data';
    
    // Test session storage (default)
    cacheManager.set(testKey, testData);
    expect(sessionStorage.getItem(`${testKey}`)).not.toBeNull();
    
    // Test local storage
    cacheManager.set(testKey, testData, { storage: 'local' });
    expect(localStorage.getItem(`${testKey}`)).not.toBeNull();
  });
});
