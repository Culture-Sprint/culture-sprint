
/**
 * Type declaration file to help TypeScript recognize string compatibility with CacheEntity
 */

import { CACHE_ENTITIES } from '../cacheKeyGenerator';

// Declare that strings are compatible with our CacheEntity type
declare global {
  // This creates a type that allows string values to be treated as CacheEntity
  type CacheEntityCompatible = keyof typeof CACHE_ENTITIES | string;
  
  // Modify the interface of the cacheKeys module to use the compatible type
  interface CacheKeyGenerators {
    form: (projectId: string, formType?: string) => string;
    project: (projectId: string) => string;
    context: (projectId: string) => string;
    activity: (projectId: string, activityId: string) => string;
    response: (responseId: string) => string;
  }
}

// Ensure this is treated as a module
export {};
