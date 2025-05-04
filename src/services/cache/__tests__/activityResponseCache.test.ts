
import '@types/jest';
import { 
  generateCacheKey,
  getCachedResponse,
  setCachedResponse,
  clearCachedResponse,
  clearAllCachedResponses,
  clearProjectCachedResponses,
  clearActivityCache
} from '../activityResponseCache';

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

describe('ActivityResponseCache', () => {
  beforeEach(() => {
    // Clear all mocks and cache data before each test
    mockStorage = {};
  });

  test('generateCacheKey should create a consistent cache key', () => {
    const projectId = 'project123';
    const phaseId = 'phase456';
    const stepId = 'step789';
    const activityId = 'activity101';
    
    const cacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
    
    expect(cacheKey).toBe('activity_project123_phase456_step789_activity101');
  });
  
  test('should set and get cached response', () => {
    const cacheKey = 'activity_test_key';
    const testData = { response: 'Test response data' };
    
    // Set cache
    setCachedResponse(cacheKey, testData);
    
    // Get cache
    const retrievedData = getCachedResponse<typeof testData>(cacheKey);
    
    expect(retrievedData).toEqual(testData);
  });
  
  test('should get specific response key from cached object', () => {
    const cacheKey = 'activity_test_key_specific';
    const testData = { 
      field1: 'value1',
      field2: 'value2',
      nested: { subfield: 'subvalue' }
    };
    
    // Set cache
    setCachedResponse(cacheKey, testData);
    
    // Get specific field
    const field1 = getCachedResponse<string>(cacheKey, 'field1');
    const nested = getCachedResponse<{subfield: string}>(cacheKey, 'nested');
    
    expect(field1).toBe('value1');
    expect(nested).toEqual({ subfield: 'subvalue' });
  });
  
  test('should clear cached response', () => {
    const cacheKey = 'activity_test_key_clear';
    setCachedResponse(cacheKey, 'to be cleared');
    
    // Verify it exists
    expect(getCachedResponse(cacheKey)).toBe('to be cleared');
    
    // Clear it
    clearCachedResponse(cacheKey);
    
    // Verify it's gone
    expect(getCachedResponse(cacheKey)).toBeNull();
  });
  
  test('should clear all cached responses', () => {
    // Set multiple responses
    setCachedResponse('activity_project1_key1', 'data1');
    setCachedResponse('activity_project2_key2', 'data2');
    setCachedResponse('other_key', 'other_data'); // Should not be cleared
    
    // Clear all activity responses
    clearAllCachedResponses();
    
    // Activity responses should be gone
    expect(getCachedResponse('activity_project1_key1')).toBeNull();
    expect(getCachedResponse('activity_project2_key2')).toBeNull();
    
    // Other keys should remain
    expect(mockStorage['other_key_data']).not.toBeUndefined();
  });
  
  test('should clear project-specific responses', () => {
    // Set responses for different projects
    setCachedResponse('activity_project1_phase1_step1_act1', 'data1');
    setCachedResponse('activity_project1_phase2_step1_act1', 'data2');
    setCachedResponse('activity_project2_phase1_step1_act1', 'data3');
    
    // Clear only project1 responses
    clearProjectCachedResponses('project1');
    
    // Project1 responses should be gone
    expect(getCachedResponse('activity_project1_phase1_step1_act1')).toBeNull();
    expect(getCachedResponse('activity_project1_phase2_step1_act1')).toBeNull();
    
    // Project2 responses should remain
    expect(getCachedResponse('activity_project2_phase1_step1_act1')).toBe('data3');
  });
  
  test('clearActivityCache should clear specific activity response', () => {
    // Set up test data
    const projectId = 'project123';
    const phaseId = 'phase456';
    const stepId = 'step789';
    const activityId = 'activity101';
    
    const cacheKey = generateCacheKey(projectId, phaseId, stepId, activityId);
    setCachedResponse(cacheKey, 'activity data');
    
    // Set another activity that should not be cleared
    setCachedResponse(generateCacheKey(projectId, phaseId, stepId, 'otherActivity'), 'other data');
    
    // Clear the specific activity
    clearActivityCache(projectId, phaseId, stepId, activityId);
    
    // Verify it's cleared
    expect(getCachedResponse(cacheKey)).toBeNull();
    
    // Other activity should remain
    expect(getCachedResponse(generateCacheKey(projectId, phaseId, stepId, 'otherActivity'))).toBe('other data');
  });
});
