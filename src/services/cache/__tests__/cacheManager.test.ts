
import '@types/jest';
import { cacheManager } from '../cacheManager';
import { CACHE_EXPIRATION } from '../cacheConfig';

// Mock sessionStorage for tests
let mockStorage: Record<string, string> = {};
const sessionStorageMock = {
  getItem: (key: string): string | null => mockStorage[key] || null,
  setItem: (key: string, value: string): void => { mockStorage[key] = value; },
  removeItem: (key: string): void => { delete mockStorage[key]; },
  clear: (): void => { mockStorage = {}; },
  key: (_index: number): string => Object.keys(mockStorage)[0],
  length: 0
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

describe('CacheManager', () => {
  beforeEach(() => {
    // Clear all mocks and cache data before each test
    mockStorage = {};
  });

  describe('Base cache operations', () => {
    test('should set and get items from cache', () => {
      const testKey = 'test_key';
      const testData = { name: 'Test User', age: 30 };
      
      cacheManager.set(testKey, testData);
      const retrievedData = cacheManager.get(testKey, null);
      
      expect(retrievedData).toEqual(testData);
    });
    
    test('should return default value when key does not exist', () => {
      const defaultValue = { default: true };
      const result = cacheManager.get('nonexistent_key', defaultValue);
      
      expect(result).toEqual(defaultValue);
    });
    
    test('should remove items from cache', () => {
      const testKey = 'test_key_to_remove';
      cacheManager.set(testKey, 'remove me');
      
      // Verify it exists
      expect(cacheManager.get(testKey, null)).toBe('remove me');
      
      // Remove it
      cacheManager.remove(testKey);
      
      // Verify it's gone
      expect(cacheManager.get(testKey, 'default')).toBe('default');
    });
  });
  
  describe('Specialized cache managers', () => {
    test('form manager should handle form cache operations', () => {
      const projectId = 'project-123';
      const formData = { title: 'Test Form', fields: [] };
      
      // Set form data
      cacheManager.form.setForm(projectId, 'default', formData);
      
      // Get form data
      const retrievedData = cacheManager.form.getForm(projectId, 'default', null);
      expect(retrievedData).toEqual(formData);
      
      // Clear form data
      cacheManager.form.removeForm(projectId);
      expect(cacheManager.form.getForm(projectId, 'default', 'fallback')).toBe('fallback');
    });
    
    test('project manager should handle project cache operations', () => {
      const projectId = 'project-456';
      const projectData = { name: 'Test Project', description: 'Test description' };
      
      // Set project data
      cacheManager.project.set(projectId, projectData);
      
      // Get project data
      expect(cacheManager.project.get(projectId, null)).toEqual(projectData);
      
      // Handle last loaded project
      cacheManager.project.setLastLoaded(projectId);
      expect(cacheManager.project.getLastLoaded()).toBe(projectId);
      
      cacheManager.project.clearLastLoaded();
      expect(cacheManager.project.getLastLoaded()).toBeNull();
    });
    
    test('context manager should handle context cache operations', () => {
      const projectId = 'project-789';
      const contextData = { contextInfo: 'Important context' };
      
      // Set context
      cacheManager.context.setContext(projectId, contextData);
      
      // Get context
      expect(cacheManager.context.getContext(projectId, null)).toEqual(contextData);
      
      // Remove context
      cacheManager.context.removeContext(projectId);
      expect(cacheManager.context.getContext(projectId, 'default context')).toBe('default context');
    });
    
    test('activity manager should handle activity cache operations', () => {
      const projectId = 'project-abc';
      const activityId = 'activity-123';
      const activityData = { responses: ['answer1', 'answer2'] };
      
      // Set activity data
      cacheManager.activity.setActivity(projectId, activityId, activityData);
      
      // Get activity data
      expect(cacheManager.activity.getActivity(projectId, activityId, null)).toEqual(activityData);
      
      // Clear activity data
      cacheManager.activity.removeActivity(projectId, activityId);
      expect(cacheManager.activity.getActivity(projectId, activityId, {})).toEqual({});
    });
  });
  
  describe('Cache expiration', () => {
    test('shouldLoadFromRemote should return true for expired cache', () => {
      const testKey = 'expired_cache_test';
      cacheManager.set(testKey, 'test_data');
      
      // Manually set expired timestamp (1 day ago)
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      sessionStorageMock.setItem(`${testKey}_timestamp`, oneDayAgo.toString());
      
      // Should load from remote since cache is expired
      expect(cacheManager.shouldLoadFromRemote(testKey, { ttl: CACHE_EXPIRATION.SHORT })).toBe(true);
    });
    
    test('shouldLoadFromRemote should return false for fresh cache', () => {
      const testKey = 'fresh_cache_test';
      cacheManager.set(testKey, 'fresh_data');
      
      // Manually set fresh timestamp (1 minute ago)
      const oneMinuteAgo = Date.now() - 60 * 1000;
      sessionStorageMock.setItem(`${testKey}_timestamp`, oneMinuteAgo.toString());
      
      // Should not load from remote since cache is fresh
      expect(cacheManager.shouldLoadFromRemote(testKey, { ttl: CACHE_EXPIRATION.MEDIUM })).toBe(false);
    });
  });
});
