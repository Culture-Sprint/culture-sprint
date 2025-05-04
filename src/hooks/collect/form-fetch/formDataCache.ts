
// Import from our centralized cache service
import { 
  generateFormCacheKey, 
  getFormDataFromCache, 
  setFormDataInCache,
  clearFormDataCache,
  clearAllFormCachesForProject,
  shouldLoadFromRemote
} from "@/services/cache/formDataCache";

// Re-export everything from the centralized service
export {
  generateFormCacheKey,
  getFormDataFromCache as loadFromFormCache,
  setFormDataInCache as saveToFormCache,
  clearFormDataCache as clearFormCache,
  clearAllFormCachesForProject as clearAllFormCaches,
  shouldLoadFromRemote
};

// Cache configuration (for backward compatibility)
const CACHE_EXPIRATION = 5 * 60 * 1000; // 5 minutes cache expiration
export { CACHE_EXPIRATION };
