
import { ProjectCacheManager } from '../managers/projectCacheManager';

describe('ProjectCacheManager', () => {
  let projectCache: ProjectCacheManager;
  
  beforeEach(() => {
    projectCache = new ProjectCacheManager();
    sessionStorage.clear();
    localStorage.clear();
  });
  
  test('should set and get project data', () => {
    const projectId = 'test-project';
    const projectData = { name: 'Test Project', status: 'active' };
    
    projectCache.set(projectId, projectData);
    const retrieved = projectCache.get<typeof projectData>(projectId, null);
    
    expect(retrieved).toEqual(projectData);
  });
  
  test('should handle different storage types', () => {
    const projectId = 'test-project';
    const projectData = { test: true };
    
    // Test session storage (default)
    projectCache.set(projectId, projectData);
    expect(projectCache.get(projectId, null)).toEqual(projectData);
    
    // Test local storage
    projectCache.set(projectId, projectData, { storage: 'local' });
    expect(projectCache.get(projectId, null, { storage: 'local' })).toEqual(projectData);
  });
  
  test('should remove project data', () => {
    const projectId = 'test-project';
    const projectData = { test: true };
    
    projectCache.set(projectId, projectData);
    projectCache.remove(projectId);
    
    expect(projectCache.get(projectId, null)).toBeNull();
  });
  
  test('should handle last loaded project operations', () => {
    const projectId = 'last-loaded-test';
    
    projectCache.setLastLoaded(projectId);
    expect(projectCache.getLastLoaded()).toBe(projectId);
    
    projectCache.clearLastLoaded();
    expect(projectCache.getLastLoaded()).toBeNull();
  });
  
  test('should handle default values when key does not exist', () => {
    const projectId = 'nonexistent';
    const defaultValue = { default: true };
    
    const result = projectCache.get(projectId, defaultValue);
    expect(result).toEqual(defaultValue);
  });
  
  test('should handle storage options consistently', () => {
    const projectId = 'storage-test';
    const projectData = { test: true };
    
    // Set in session storage
    projectCache.set(projectId, projectData, { storage: 'session' });
    expect(projectCache.get(projectId, null, { storage: 'session' })).toEqual(projectData);
    expect(projectCache.get(projectId, null, { storage: 'local' })).toBeNull();
    
    // Set in local storage
    projectCache.set(projectId, projectData, { storage: 'local' });
    expect(projectCache.get(projectId, null, { storage: 'local' })).toEqual(projectData);
  });
});
