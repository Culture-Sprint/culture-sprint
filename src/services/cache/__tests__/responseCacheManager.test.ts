
import { ResponseCacheManager } from '../managers/responseCacheManager';
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

describe('ResponseCacheManager', () => {
  let responseCacheManager: ResponseCacheManager;
  
  beforeEach(() => {
    mockStorage = {};
    responseCacheManager = new ResponseCacheManager();
  });
  
  test('should store and retrieve responses by activity', () => {
    const projectId = 'project123';
    const activityId = 'activity456';
    const responseData = { value: 'test response data' };
    
    responseCacheManager.setResponse(projectId, activityId, responseData);
    const retrieved = responseCacheManager.getResponse(projectId, activityId, null);
    
    expect(retrieved).toEqual(responseData);
  });
  
  test('should store and retrieve responses by path', () => {
    const projectId = 'project123';
    const phaseId = 'phase456';
    const stepId = 'step789';
    const activityId = 'activity101';
    const responseData = { value: 'test path response' };
    
    responseCacheManager.setResponseByPath(projectId, phaseId, stepId, activityId, responseData);
    const retrieved = responseCacheManager.getResponseByPath(projectId, phaseId, stepId, activityId, null);
    
    expect(retrieved).toEqual(responseData);
  });
  
  test('should generate consistent response keys', () => {
    const projectId = 'project123';
    const phaseId = 'phase456';
    const stepId = 'step789';
    const activityId = 'activity101';
    
    const key = responseCacheManager.generateResponseKey(projectId, phaseId, stepId, activityId);
    expect(key).toBe(`response_${projectId}_${phaseId}_${stepId}_${activityId}`);
  });
  
  test('should clear project responses', () => {
    const projectId = 'project123';
    const phaseId = 'phase456';
    const stepId = 'step789';
    const activityId1 = 'activity101';
    const activityId2 = 'activity102';
    const anotherProjectId = 'project456';
    
    // Set responses for our test project
    responseCacheManager.setResponseByPath(projectId, phaseId, stepId, activityId1, { data: 'test1' });
    responseCacheManager.setResponseByPath(projectId, phaseId, stepId, activityId2, { data: 'test2' });
    
    // Set response for another project (shouldn't be cleared)
    responseCacheManager.setResponseByPath(anotherProjectId, phaseId, stepId, activityId1, { data: 'other' });
    
    // Clear only responses for our test project
    responseCacheManager.clearProjectResponses(projectId);
    
    // Check our test project responses are cleared
    expect(responseCacheManager.getResponseByPath(projectId, phaseId, stepId, activityId1, 'default')).toBe('default');
    expect(responseCacheManager.getResponseByPath(projectId, phaseId, stepId, activityId2, 'default')).toBe('default');
    
    // Check the other project response is still there
    expect(responseCacheManager.getResponseByPath(anotherProjectId, phaseId, stepId, activityId1, null)).toEqual({ data: 'other' });
  });
  
  test('should handle TTL correctly', () => {
    const projectId = 'project123';
    const activityId = 'activity456';
    const responseData = { value: 'test response data' };
    
    // Set with custom TTL
    responseCacheManager.setResponse(projectId, activityId, responseData, { ttl: CACHE_EXPIRATION.SHORT });
    
    // Set expired timestamp (10 minutes ago)
    const tenMinutesAgo = Date.now() - (10 * 60 * 1000);
    sessionStorageMock.setItem(
      `${responseCacheManager.generateResponseKey(projectId, '', '', activityId)}_timestamp`, 
      tenMinutesAgo.toString()
    );
    
    // With SHORT expiration (1 minute), the cache should be considered expired
    expect(responseCacheManager.shouldLoadFromRemote(
      `${responseCacheManager.generateResponseKey(projectId, '', '', activityId)}`, 
      { ttl: CACHE_EXPIRATION.SHORT }
    )).toBe(true);
  });
});
