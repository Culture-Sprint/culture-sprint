
import { useRef } from "react";
import { 
  generateFormCacheKey,
  getFormDataFromCache, 
  setFormDataInCache, 
  clearFormDataCache,
  shouldLoadFromRemote as checkShouldLoadFromRemote
} from "@/services/cache/formDataCache";
import { logFormAction } from "../form-load/formLoadingUtils";

/**
 * Hook providing core form data caching functionality
 * 
 * @param projectId - Optional project ID for scoping cache operations
 * @returns Cache operations and utilities
 */
export function useFormDataCache(projectId?: string) {
  // Generate a consistent cache key using the standard function
  const cacheKey = projectId ? generateFormCacheKey(projectId, 'form_data') : 'form_global_form_data';
  const lastLoadedProjectId = useRef<string | undefined>(projectId);

  /**
   * Check if data should be loaded from remote source
   */
  const shouldLoadFromRemote = () => {
    const shouldLoad = checkShouldLoadFromRemote(cacheKey);
    logFormAction("CacheCheck", { 
      projectId, 
      shouldLoadFromRemote: shouldLoad,
      cacheKey 
    });
    return shouldLoad;
  };

  /**
   * Load data from cache
   * @param defaultValue - Default value to return if no cache exists
   */
  const loadFromCache = <T>(defaultValue: T): T => {
    try {
      console.time(`[Cache][${projectId || 'global'}] Loading data`);
      if (!projectId) return defaultValue;
      
      const cachedData = getFormDataFromCache<T>(projectId, 'form_data', defaultValue);
      const hasCachedData = !!cachedData && (typeof cachedData === 'object');
      console.timeEnd(`[Cache][${projectId || 'global'}] Loading data`);
      
      logFormAction("CacheLoad", { 
        projectId, 
        hasCachedData, 
        cacheKey 
      });
      
      return cachedData;
    } catch (error) {
      logFormAction("CacheLoadError", { projectId, error, cacheKey });
      return defaultValue;
    }
  };

  /**
   * Save data to cache
   * @param data - Data to save in the cache
   */
  const saveToCache = <T>(data: T): void => {
    try {
      console.time(`[Cache][${projectId || 'global'}] Saving data`);
      if (!projectId) return;
      
      setFormDataInCache<T>(projectId, 'form_data', data);
      console.timeEnd(`[Cache][${projectId || 'global'}] Saving data`);
      
      logFormAction("CacheSave", { projectId, cacheKey });
    } catch (error) {
      logFormAction("CacheSaveError", { projectId, error, cacheKey });
    }
  };

  /**
   * Clear cache for the current project
   */
  const clearCache = (): void => {
    try {
      if (!projectId) return;
      clearFormDataCache(projectId, 'form_data');
      logFormAction("CacheClear", { projectId, cacheKey });
    } catch (error) {
      logFormAction("CacheClearError", { projectId, error, cacheKey });
    }
  };

  /**
   * Clear all session storage cache keys related to this project
   */
  const clearSessionCache = (): void => {
    try {
      if (!projectId) return;
      
      const projIdStr = String(projectId);
      Object.keys(sessionStorage).forEach(key => {
        if (key.includes(projIdStr) || key.includes('form_data')) {
          console.log(`Clearing session storage key: ${key}`);
          sessionStorage.removeItem(key);
        }
      });
      
      logFormAction("SessionCacheClear", { projectId });
    } catch (error) {
      logFormAction("SessionCacheClearError", { projectId, error });
    }
  };

  return {
    cacheKey,
    lastLoadedProjectId,
    shouldLoadFromRemote,
    loadFromCache,
    saveToCache,
    clearCache,
    clearSessionCache
  };
}
