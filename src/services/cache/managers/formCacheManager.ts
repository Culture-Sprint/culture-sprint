
import { CacheOptions } from '../types/cacheTypes';
import { BaseCacheManager } from './baseCacheManager';
import { cacheKeys } from '../cacheKeyGenerator';

/**
 * Specialized cache manager for form data
 */
export class FormCacheManager extends BaseCacheManager {
  /**
   * Get form data by project ID and form type
   */
  getFormData<T>(projectId: string, formType = 'default', defaultValue: T = null as unknown as T, options: CacheOptions = {}): T {
    const key = cacheKeys.form(projectId, formType);
    return super.get<T>(key, defaultValue, options);
  }

  /**
   * Store form data by project ID and form type
   */
  setFormData<T>(projectId: string, formType = 'default', data: T, options: CacheOptions = {}): void {
    const key = cacheKeys.form(projectId, formType);
    super.set<T>(key, data, options);
  }

  /**
   * Remove form data by project ID and form type
   */
  removeFormData(projectId: string, formType = 'default', options: CacheOptions = {}): void {
    const key = cacheKeys.form(projectId, formType);
    super.remove(key, options);
  }

  /**
   * Clear all form data for a specific project
   */
  clearProjectFormData(projectId: string, options: CacheOptions = {}): void {
    const pattern = `form_${projectId}_*`;
    super.clearPattern(pattern, options);
  }

  /**
   * Check if form data should be loaded from remote
   */
  shouldLoadFromRemote(key: string, options: CacheOptions = {}): boolean {
    return !super.isValid(key, options);
  }
  
  // Alias methods for compatibility with tests
  getForm<T>(projectId: string, formType = 'default', defaultValue: T = null as unknown as T, options: CacheOptions = {}): T {
    return this.getFormData<T>(projectId, formType, defaultValue, options);
  }
  
  setForm<T>(projectId: string, formType = 'default', data: T, options: CacheOptions = {}): void {
    this.setFormData(projectId, formType, data, options);
  }
  
  removeForm(projectId: string, formType = 'default', options: CacheOptions = {}): void {
    this.removeFormData(projectId, formType, options);
  }
  
  clearAll(projectId: string, options: CacheOptions = {}): void {
    this.clearProjectFormData(projectId, options);
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
