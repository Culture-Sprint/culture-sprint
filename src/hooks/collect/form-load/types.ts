
import { FormDataState } from "@/types/formTypes";
import { SliderQuestion, ParticipantQuestion } from "@/services/types/designTypes";

/**
 * Form data loading result with cache and loading helpers
 */
export interface FormDataLoadingResult extends FormDataState {
  /**
   * Force reload the form data from remote source
   */
  reloadFromRemote: () => Promise<void>;
  
  /**
   * Clear all form data caches
   */
  clearCache: () => void;
}

/**
 * Fetch options for form data
 */
export interface FormDataFetchOptions {
  /**
   * Project ID to fetch form data for
   */
  projectId?: string | null;
  
  /**
   * Whether this is for a public form (no auth required)
   */
  isPublic?: boolean;
  
  /**
   * Skip cache and force fetch from remote source
   */
  forceRefresh?: boolean;
}

/**
 * Cache handling utilities for form data
 */
export interface FormDataCacheUtils {
  /**
   * Check if data should be loaded from remote source
   */
  shouldLoadFromRemote: () => boolean;
  
  /**
   * Load form data from cache
   */
  loadFromCache: <T>(defaultValue: T) => T;
  
  /**
   * Save form data to cache
   */
  saveToCache: <T>(data: T) => void;
  
  /**
   * Clear form data cache
   */
  clearCache: () => void;
}

/**
 * Form data fetch utilities
 */
export interface FormDataFetchUtils {
  /**
   * Fetch form data from remote source for a project
   */
  fetchProjectFormData: (projectId: string) => Promise<FormDataState>;
  
  /**
   * Fetch local form data (no project)
   */
  fetchLocalFormData: () => Promise<FormDataState>;
  
  /**
   * Handle fetch errors
   */
  handleFetchError: (error: any) => FormDataState;
}
