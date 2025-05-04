
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
    return checkShouldLoadFromRemote(cacheKey);
  };

  const loadFromCache = <T>(defaultValue: T): T => {
    try {
      if (!projectId) return defaultValue;
      return getFormDataFromCache<T>(projectId, 'form_data', defaultValue);
    } catch (error) {
      console.error(`Cache load error for project ${projectId}:`, error);
      return defaultValue;
    }
  };

  const saveToCache = <T>(data: T): void => {
    try {
      if (!projectId) return;
      setFormDataInCache<T>(projectId, 'form_data', data);
    } catch (error) {
      console.error(`Cache save error for project ${projectId}:`, error);
    }
  };

  const clearCache = (): void => {
    try {
      if (!projectId) return;
      clearFormDataCache(projectId, 'form_data');
    } catch (error) {
      console.error(`Cache clear error for project ${projectId}:`, error);
    }
  };

  return {
    lastLoadedProjectId,
    shouldLoadFromRemote,
    loadFromCache,
    saveToCache,
    clearCache,
  };
};
