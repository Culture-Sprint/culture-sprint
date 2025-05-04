
import { ActivityCacheManager } from '../managers/activityCacheManager';

describe('ActivityCacheManager', () => {
  let activityCache: ActivityCacheManager;
  
  beforeEach(() => {
    activityCache = new ActivityCacheManager();
    sessionStorage.clear();
    localStorage.clear();
  });
  
  test('should set and get activity data', () => {
    const projectId = 'test-project';
    const activityId = 'test-activity';
    const activityData = { name: 'Test Activity', status: 'active' };
    
    activityCache.setActivity(projectId, activityId, activityData);
    const retrieved = activityCache.getActivity<typeof activityData>(projectId, activityId, null);
    
    expect(retrieved).toEqual(activityData);
  });
  
  test('should handle different storage types', () => {
    const projectId = 'test-project';
    const activityId = 'test-activity';
    const activityData = { test: true };
    
    // Test session storage (default)
    activityCache.setActivity(projectId, activityId, activityData);
    expect(activityCache.getActivity(projectId, activityId, null)).toEqual(activityData);
    
    // Test local storage
    activityCache.setActivity(projectId, activityId, activityData, { storage: 'local' });
    expect(activityCache.getActivity(projectId, activityId, null, { storage: 'local' })).toEqual(activityData);
  });
  
  test('should remove activity data', () => {
    const projectId = 'test-project';
    const activityId = 'test-activity';
    const activityData = { test: true };
    
    activityCache.setActivity(projectId, activityId, activityData);
    activityCache.removeActivity(projectId, activityId);
    
    expect(activityCache.getActivity(projectId, activityId, null)).toBeNull();
  });
  
  test('should clear all activities for a project', () => {
    const projectId = 'test-project';
    
    activityCache.setActivity(projectId, 'activity1', { data: 1 });
    activityCache.setActivity(projectId, 'activity2', { data: 2 });
    activityCache.setActivity('other-project', 'activity1', { data: 3 });
    
    activityCache.clearAll(projectId);
    
    expect(activityCache.getActivity(projectId, 'activity1', null)).toBeNull();
    expect(activityCache.getActivity(projectId, 'activity2', null)).toBeNull();
    expect(activityCache.getActivity('other-project', 'activity1', null)).not.toBeNull();
  });
  
  test('should handle default values when key does not exist', () => {
    const projectId = 'nonexistent';
    const activityId = 'nonexistent';
    const defaultValue = { default: true };
    
    const result = activityCache.getActivity(projectId, activityId, defaultValue);
    expect(result).toEqual(defaultValue);
  });
});
