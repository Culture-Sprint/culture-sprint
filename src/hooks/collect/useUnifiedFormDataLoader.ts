import { useState, useEffect, useCallback, useRef } from "react";
import { FormDataState } from "@/types/formTypes";
import { useFormDataCache } from "./form-cache/useFormDataCache";
import { useFormDataFetchUtils } from "./form-fetch/useFormDataFetchUtils";
import { setLastLoadedProjectId, clearLastLoadedProjectId } from "@/services/cache/projectCache";
import { logFormAction } from "./form-load/formLoadingUtils";

/**
 * Unified form data loading hook
 * 
 * @param projectId - Project ID to load form data for, null for no project
 * @param isPublic - Whether to load public form data
 * @returns Form data and operations
 */
export function useUnifiedFormDataLoader(projectId: string | null, isPublic: boolean = false) {
  // Form data state
  const [formData, setFormData] = useState<FormDataState>({
    storyQuestion: "",
    sliderQuestions: [],
    participantQuestions: [],
    isLoading: true,
    formDesigned: false
  });
  
  // Refresh counter for forcing refreshes
  const [refreshCounter, setRefreshCounter] = useState(0);
  const requestIdRef = useRef<string>(Date.now().toString());
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Import cache and fetch utilities
  const { 
    lastLoadedProjectId,
    shouldLoadFromRemote, 
    loadFromCache, 
    saveToCache, 
    clearCache,
    clearSessionCache,
    cacheKey
  } = useFormDataCache(projectId || undefined);
  
  const { 
    fetchProjectFormData,
    fetchPublicFormData, 
    fetchLocalFormData, 
    handleFetchError 
  } = useFormDataFetchUtils();

  /**
   * Load data from either cache or remote source
   */
  useEffect(() => {
    // Skip if we're not refreshing and already have data for this project
    if (projectId === lastLoadedProjectId.current && !formData.isLoading && refreshCounter === 0) {
      console.log(`🔄 [FormDataLoader] No changes detected for project ${projectId}, skipping load`);
      return;
    }
    
    // Generate a unique request ID to track this specific data loading operation
    const currentRequestId = Date.now().toString();
    requestIdRef.current = currentRequestId;
    
    // Set a minimum loading time to prevent rapid flickering
    const setStableLoadingState = (isLoading: boolean) => {
      // Clear any existing timer
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      
      if (isLoading) {
        // Set to loading immediately
        setFormData(prev => ({...prev, isLoading: true}));
      } else {
        // Minimum loading time of 300ms to prevent flickering
        loadingTimerRef.current = setTimeout(() => {
          // Only update state if this is still the current request
          if (requestIdRef.current === currentRequestId) {
            setFormData(prev => ({...prev, isLoading: false}));
          }
        }, 300);
      }
    };
    
    // Keep track of the last project ID we loaded data for
    lastLoadedProjectId.current = projectId || undefined;

    // Define data loading function
    const loadData = async () => {
      if (!projectId) {
        setFormData({
          storyQuestion: "",
          sliderQuestions: [],
          participantQuestions: [],
          isLoading: false,
          formDesigned: false
        });
        console.log(`ℹ️ [FormDataLoader] No project ID provided, using empty form data`);
        return;
      }

      console.log(`🔄 [FormDataLoader] Loading form data for project ${projectId}, isPublic=${isPublic}`);
      
      // Set loading state with stable timing
      setStableLoadingState(true);
      
      // First check cache to potentially avoid a fetch
      const cachedData = loadFromCache<FormDataState | null>(null);
      if (cachedData && !shouldLoadFromRemote() && !window.location.pathname.includes('/collect')) {
        console.log(`✅ [FormDataLoader] Using cached form data for project ${projectId}`);
        console.log(`📊 [FormDataLoader] Cached data summary: ${cachedData.storyQuestion ? 'has story question' : 'no story question'}, ${cachedData.sliderQuestions?.length || 0} slider questions, ${cachedData.participantQuestions?.length || 0} participant questions`);
        
        // Only update if this is still the current request
        if (requestIdRef.current === currentRequestId) {
          setFormData({ ...cachedData, isLoading: false });
          setStableLoadingState(false);
        }
        return;
      }

      try {
        // Choose fetch method based on whether this is a public form
        let fetchedData: FormDataState;
        
        if (isPublic) {
          console.log(`🌐 [FormDataLoader] Fetching public form data from database for ${projectId}`);
          fetchedData = await fetchPublicFormData(projectId);
        } else {
          console.log(`🌐 [FormDataLoader] Fetching authenticated form data from database for ${projectId}`);
          fetchedData = await fetchProjectFormData(projectId);
          
          // Cache the data for authenticated forms
          console.log(`💾 [FormDataLoader] Saving fetched data to cache for ${projectId}`);
          saveToCache(fetchedData);
          
          // Update last loaded project ID in cache
          setLastLoadedProjectId(projectId);
        }
        
        console.log(`📊 [FormDataLoader] Fetched data summary: ${fetchedData.storyQuestion ? 'has story question' : 'no story question'}, ${fetchedData.sliderQuestions?.length || 0} slider questions, ${fetchedData.participantQuestions?.length || 0} participant questions`);
        
        // Only update if this is still the current request
        if (requestIdRef.current === currentRequestId) {
          setFormData({ ...fetchedData, isLoading: false });
          setStableLoadingState(false);
        }
      } catch (error) {
        console.error(`❌ [FormDataLoader] Error fetching form data for ${projectId}:`, error);
        
        // Only update if this is still the current request
        if (requestIdRef.current === currentRequestId) {
          setFormData(prev => ({ ...prev, isLoading: false }));
          setStableLoadingState(false);
        }
      }
    };

    loadData();
    
    // Clean up any pending timers
    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [projectId, refreshCounter, isPublic]);

  /**
   * Refresh form data by fetching from remote
   */
  const refreshFormData = useCallback(async () => {
    if (!projectId) return;
    
    console.log(`Refreshing form data for project ${projectId}`);
    setFormData(prev => ({ ...prev, isLoading: true }));
    
    try {
      clearCache();
      
      // Choose fetch method based on whether this is a public form
      let fetchedData: FormDataState;
      
      if (isPublic) {
        fetchedData = await fetchPublicFormData(projectId);
      } else {
        fetchedData = await fetchProjectFormData(projectId);
        saveToCache(fetchedData);
      }
      
      setFormData({ ...fetchedData, isLoading: false });
      
      logFormAction("RefreshFormDataSuccess", { projectId });
    } catch (error) {
      console.error(`Error refreshing form data for ${projectId}:`, error);
      setFormData(prev => ({ ...prev, isLoading: false }));
      logFormAction("RefreshFormDataError", { projectId, error });
    }
  }, [projectId, isPublic, clearCache, saveToCache]);

  /**
   * Force a reload from remote source by clearing cache and incrementing refresh counter
   */
  const reloadFromRemote = useCallback(() => {
    if (!projectId) return;
    
    console.log(`Forcing reload from remote for project ${projectId}`);
    setFormData(prev => ({ ...prev, isLoading: true }));
    
    // Clear caches
    clearCache();
    clearSessionCache();
    clearLastLoadedProjectId();
    
    // Trigger refresh
    setRefreshCounter(prev => prev + 1);
    
    logFormAction("ForceReloadTriggered", { projectId });
  }, [projectId, clearCache, clearSessionCache]);

  return {
    ...formData,
    refreshFormData,
    reloadFromRemote,
    isLoading: formData.isLoading,
    fetchProjectFormData,
    fetchLocalFormData,
    handleFetchError
  };
}
