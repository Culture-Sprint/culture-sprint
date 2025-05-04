
/**
 * Form collection hooks and utilities
 */

// Export legacy hooks (for backward compatibility)
export { useFormCache } from './useFormCache';
export { useFormDataFetcher } from './useFormDataFetcher';
export { useFormDataLoader } from './useFormDataLoader';
export { useFormDataHelper } from './useFormDataHelper';

// Export new unified hooks
export { useUnifiedFormDataLoader } from './useUnifiedFormDataLoader';
export { useFormDataCache } from './form-cache/useFormDataCache';
export { useFormDataFetchUtils } from './form-fetch/useFormDataFetchUtils';
