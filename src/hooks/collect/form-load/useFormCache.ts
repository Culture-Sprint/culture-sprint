
import { useRef } from "react";
import { 
  generateFormCacheKey,
  getFormDataFromCache, 
  setFormDataInCache, 
  clearFormDataCache,
  shouldLoadFromRemote as checkShouldLoadFromRemote
} from "@/services/cache/formDataCache";
import { FormDataCacheUtils } from "./types";
import { logFormAction } from "./formLoadingUtils";

/**
 * Hook for managing form data caching
 * @param projectId Project ID for cache key
 * @returns Form cache utilities
 */
export function useFormCache(projectId?: string): FormDataCacheUtils & { lastLoadedProjectId: React.MutableRefObject<string | undefined> } {
  // Generate a consistent cache key using the standard function
  const cacheKey = projectId ? generateFormCacheKey(projectId, 'form_data') : 'form_global_form_data';
  const lastLoadedProjectId = useRef<string | undefined>(projectId);

  const shouldLoadFromRemote = () => {
    const shouldLoad = checkShouldLoadFromRemote(cacheKey);
    logFormAction("CacheCheck", { 
      projectId, 
      shouldLoadFromRemote: shouldLoad,
      cacheKey 
    });
    return shouldLoad;
  };

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

  const clearCache = (): void => {
    try {
      if (!projectId) return;
      clearFormDataCache(projectId, 'form_data');
      logFormAction("CacheClear", { projectId, cacheKey });
    } catch (error) {
      logFormAction("CacheClearError", { projectId, error, cacheKey });
    }
  };

  return {
    lastLoadedProjectId,
    shouldLoadFromRemote,
    loadFromCache,
    saveToCache,
    clearCache,
  };
}
