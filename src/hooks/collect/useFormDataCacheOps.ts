
import { generateFormCacheKey, saveToFormCache, loadFromFormCache, clearFormCache, shouldLoadFromRemote } from "./form-fetch/formDataCache";

/**
 * Hook for generating, saving, loading, and clearing form cache consistently.
 */
export const useFormDataCacheOps = (projectId: string | null) => {
  // Always generate the cache key standard way
  const cacheKey = projectId ? generateFormCacheKey(projectId, 'form_data') : 'form_global_form_data';

  /** Save to cache */
  const save = <T>(data: T) => {
    if (!projectId) return;
    saveToFormCache(projectId, 'form_data', data);
  };

  /** Load from cache, returns null if not found */
  const load = <T>(defaultValue: T): T | null => {
    if (!projectId) return defaultValue;
    return loadFromFormCache<T>(projectId, 'form_data', defaultValue);
  };

  /** Clear single cache key */
  const clear = () => {
    if (!projectId) return;
    clearFormCache(projectId, 'form_data');
  };

  /** Check if cache is expired or absent */
  const shouldLoadRemote = () => shouldLoadFromRemote(cacheKey);

  /** Remove all sessionStorage keys related to this projectId */
  const clearSessionStorage = () => {
    Object.keys(sessionStorage).forEach(key => {
      if (
        key.includes(projectId ?? "") ||
        key.includes('form_data') ||
        key.includes('slider')
      ) {
        console.log("[CacheOps] Removing session key:", key);
        sessionStorage.removeItem(key);
      }
    });
  };

  return {
    cacheKey,
    save,
    load,
    clear,
    shouldLoadRemote,
    clearSessionStorage,
  };
};
