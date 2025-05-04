
import { useRef } from "react";
import { 
  generateFormCacheKey,
  getFormDataFromCache, 
  setFormDataInCache, 
  clearFormDataCache,
  shouldLoadFromRemote as checkShouldLoadFromRemote
} from "@/services/cache/formDataCache";

export const useFormCache = (projectId?: string) => {
  const cacheKey = projectId ? generateFormCacheKey(projectId, 'form_data') : 'form_global_form_data';
  const lastLoadedProjectId = useRef<string | undefined>(projectId);

  const shouldLoadFromRemote = () => {
    const shouldLoad = checkShouldLoadFromRemote(cacheKey);
    console.log(`🔄 [Cache] Checking if should load from remote for ${projectId || 'global'}: ${shouldLoad ? 'YES' : 'NO'}`);
    return shouldLoad;
  };

  const loadFromCache = <T>(defaultValue: T): T => {
    try {
      if (!projectId) {
        console.log(`📂 [Cache] No project ID provided, using default value`);
        return defaultValue;
      }
      
      console.log(`📂 [Cache] Attempting to load data from cache for project ${projectId}`);
      const cachedData = getFormDataFromCache<T>(projectId, 'form_data', defaultValue);
      
      if (cachedData !== defaultValue) {
        console.log(`✅ [Cache] Cache HIT - Found data in cache for project ${projectId}`);
      } else {
        console.log(`❌ [Cache] Cache MISS - No data found in cache for project ${projectId}`);
      }
      
      return cachedData;
    } catch (error) {
      console.error(`❌ [Cache] Error loading from cache for project ${projectId}:`, error);
      return defaultValue;
    }
  };

  const saveToCache = <T>(data: T): void => {
    try {
      if (!projectId) return;
      console.log(`💾 [Cache] Saving data to cache for project ${projectId}`);
      setFormDataInCache<T>(projectId, 'form_data', data);
      console.log(`✅ [Cache] Successfully saved data to cache for project ${projectId}`);
    } catch (error) {
      console.error(`❌ [Cache] Error saving to cache for project ${projectId}:`, error);
    }
  };

  const clearCache = (): void => {
    try {
      if (!projectId) return;
      console.log(`🗑️ [Cache] Clearing cache for project ${projectId}`);
      clearFormDataCache(projectId, 'form_data');
      console.log(`✅ [Cache] Cache cleared for project ${projectId}`);
    } catch (error) {
      console.error(`❌ [Cache] Error clearing cache for project ${projectId}:`, error);
    }
  };

  return {
    lastLoadedProjectId,
    shouldLoadFromRemote,
    loadFromCache,
    saveToCache,
    clearCache,
    cacheKey,
  };
};
