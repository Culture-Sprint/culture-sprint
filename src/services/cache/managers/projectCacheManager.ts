
import { CacheOptions } from '../types/cacheTypes';
import { BaseCacheManager } from './baseCacheManager';
import { cacheKeys } from '../cacheKeyGenerator';

/**
 * Specialized cache manager for project data
 */
export class ProjectCacheManager extends BaseCacheManager {
  // Constants for project cache keys
  private readonly LAST_LOADED_PROJECT_KEY = 'last_loaded_project_id';

  /**
   * Get project data
   */
  getProject<T>(projectId: string, defaultValue: T = null as unknown as T, options: CacheOptions = {}): T {
    const key = cacheKeys.project(projectId);
    return super.get<T>(key, defaultValue, options);
  }

  /**
   * Store project data
   */
  setProject<T>(projectId: string, data: T, options: CacheOptions = {}): void {
    const key = cacheKeys.project(projectId);
    super.set<T>(key, data, options);
  }

  /**
   * Remove project data
   */
  removeProject(projectId: string, options: CacheOptions = {}): void {
    const key = cacheKeys.project(projectId);
    super.remove(key, options);
  }

  /**
   * Clear all project data
   */
  clearAllProjects(options: CacheOptions = {}): void {
    const pattern = 'project_*';
    super.clearPattern(pattern, options);
  }

  /**
   * Check if project data is valid
   */
  isProjectValid(projectId: string, options: CacheOptions = {}): boolean {
    const key = cacheKeys.project(projectId);
    return super.isValid(key, options);
  }

  /**
   * Get the last loaded project ID
   */
  getLastLoaded(options: CacheOptions = {}): string | null {
    return super.get<string>(this.LAST_LOADED_PROJECT_KEY, null, options);
  }

  /**
   * Set the last loaded project ID
   */
  setLastLoaded(projectId: string, options: CacheOptions = {}): void {
    super.set<string>(this.LAST_LOADED_PROJECT_KEY, projectId, options);
  }

  /**
   * Clear the last loaded project ID
   */
  clearLastLoaded(options: CacheOptions = {}): void {
    super.remove(this.LAST_LOADED_PROJECT_KEY, options);
  }

  // Implement inherited methods to maintain interface compatibility
  get<T>(key: string, defaultValue: T, options?: CacheOptions): T {
    return super.get(key, defaultValue, options);
  }

  set<T>(key: string, data: T, options?: CacheOptions): void {
    super.set(key, data, options);
  }

  remove(key: string, options?: CacheOptions): void {
    super.remove(key, options);
  }
}
