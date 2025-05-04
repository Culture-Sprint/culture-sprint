
import { cacheManager } from './cacheManager';
import { CACHE_EXPIRATION } from './cacheConfig';
import { CacheOptions } from './types/cacheTypes';

/**
 * Generates a cache key for form data
 */
export const generateFormCacheKey = (projectId: string, formType = 'default'): string => {
  return `form_${projectId}_${formType}_v1`;
};

/**
 * Get form data from cache
 */
export const getFormDataFromCache = <T>(
  projectId: string, 
  formType = 'default', 
  defaultValue: T = null as unknown as T,
  options: CacheOptions = {}
): T => {
  const key = generateFormCacheKey(projectId, formType);
  console.log(`📂 [FormCache] Getting data from cache with key: ${key}`);
  const result = cacheManager.form.getFormData<T>(projectId, formType, defaultValue, options);
  console.log(`📂 [FormCache] Cache ${result === defaultValue ? 'MISS' : 'HIT'} for key: ${key}`);
  return result;
};

/**
 * Store form data in cache
 */
export const setFormDataInCache = <T>(
  projectId: string, 
  formType = 'default', 
  data: T,
  options: CacheOptions = {}
): void => {
  const key = generateFormCacheKey(projectId, formType);
  console.log(`💾 [FormCache] Saving data to cache with key: ${key}`);
  cacheManager.form.setFormData<T>(projectId, formType, data, options);
};

/**
 * Clear form data cache
 */
export const clearFormDataCache = (
  projectId: string, 
  formType = 'default',
  options: CacheOptions = {}
): void => {
  const key = generateFormCacheKey(projectId, formType);
  console.log(`🗑️ [FormCache] Clearing cache with key: ${key}`);
  cacheManager.form.removeFormData(projectId, formType, options);
};

/**
 * Clear all form caches for a specific project
 */
export const clearAllFormCachesForProject = (
  projectId: string,
  options: CacheOptions = {}
): void => {
  console.log(`🗑️ [FormCache] Clearing all form caches for project: ${projectId}`);
  cacheManager.form.clearProjectFormData(projectId, options);
};

/**
 * Check if form data should be loaded from remote
 */
export const shouldLoadFromRemote = (cacheKey: string): boolean => {
  // Extract projectId and formType from the cache key
  const parts = cacheKey.split('_');
  if (parts.length >= 3) {
    const projectId = parts[1];
    const formType = parts[2];
    
    // Use the form manager's shouldLoadFromRemote with the proper options
    const shouldLoad = cacheManager.form.shouldLoadFromRemote(cacheKey, { 
      ttl: CACHE_EXPIRATION.MEDIUM 
    });
    console.log(`🔄 [FormCache] Should load from remote for key ${cacheKey}: ${shouldLoad ? 'YES' : 'NO'}`);
    return shouldLoad;
  }
  return true;
};

// Export default object for backward compatibility
export default {
  getFormDataFromCache,
  setFormDataInCache,
  clearFormDataCache,
  clearAllFormCachesForProject,
  shouldLoadFromRemote,
  generateFormCacheKey
};
