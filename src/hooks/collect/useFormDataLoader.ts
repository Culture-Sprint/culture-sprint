
import { useState, useEffect, useRef } from "react";
import { FormData, FormDataWithFetchers } from "./form-fetch/formDataTypes";
import { fetchProjectFormData, fetchLocalFormData, handleFetchError } from "./form-fetch/formDataFetchUtils";
import { useFormDataCacheOps } from "./useFormDataCacheOps";
import { useAuthenticatedFormDataFetch } from "./useAuthenticatedFormDataFetch";
import { usePublicFormDataFetch } from "./usePublicFormDataFetch";
import { useSessionCacheClear } from "./useSessionCacheClear";
import { getLastLoadedProjectId, setLastLoadedProjectId, clearLastLoadedProjectId } from "@/services/cache/projectCache";

export const useFormDataLoader = (projectId: string | null, isPublic: boolean = false): FormDataWithFetchers => {
  const [formData, setFormData] = useState<FormData>({
    storyQuestion: "",
    sliderQuestions: [],
    participantQuestions: [],
    isLoading: true,
  });
  const lastProjectIdRef = useRef<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const {
    cacheKey,
    save,
    load,
    clear,
    shouldLoadRemote,
    clearSessionStorage,
  } = useFormDataCacheOps(projectId);

  const doClearSessionCache = useSessionCacheClear(projectId);

  useEffect(() => {
    // Check if we've switched projects - if so, we need to clear any cached data
    if (projectId !== lastProjectIdRef.current && lastProjectIdRef.current !== null) {
      console.log(`Project changed from ${lastProjectIdRef.current} to ${projectId}, clearing cache`);
      clear();
      doClearSessionCache();
      
      // Clear the last loaded project ID from cache when switching projects
      clearLastLoadedProjectId();
    }
    
    if (projectId === lastProjectIdRef.current && !formData.isLoading && refreshCounter === 0) {
      return;
    }

    lastProjectIdRef.current = projectId;

    const fetchData = async () => {
      if (!projectId) {
        setFormData({
          storyQuestion: "",
          sliderQuestions: [],
          participantQuestions: [],
          isLoading: false,
        });
        return;
      }

      console.log(`useFormDataLoader: Loading form data for project ${projectId}, isPublic=${isPublic}`);
      
      const isCollectPage = window.location.pathname.includes('/collect');
      const isPublicSubmitPage = window.location.pathname.includes('/submit-story');

      // First check cache to potentially avoid a fetch
      const cachedData = load<FormData>(null);
      if (cachedData && !shouldLoadRemote() && !isCollectPage) {
        console.log(`useFormDataLoader: Using cached form data for ${projectId}`);
        setFormData({ ...cachedData, isLoading: false });
        return;
      }

      try {
        if (!isPublicSubmitPage) {
          console.log(`useFormDataLoader: Fetching authenticated form data for ${projectId}`);
          await useAuthenticatedFormDataFetch(projectId, save, cacheKey, setFormData);
          setLastLoadedProjectId(projectId);
        } else {
          console.log(`useFormDataLoader: Fetching public form data for ${projectId}`);
          await usePublicFormDataFetch(projectId, save, cacheKey, setFormData);
        }
      } catch (error) {
        console.error(`useFormDataLoader: Error fetching form data for ${projectId}:`, error);
        setFormData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, refreshCounter]);

  const refreshFormData = async () => {
    if (!projectId) return;
    
    console.log(`useFormDataLoader: Refreshing form data for project ${projectId}`);
    setFormData((prev) => ({ ...prev, isLoading: true }));
    setRefreshCounter((prev) => prev + 1);

    try {
      clear();
      const isPublicForm = window.location.pathname.includes('/submit-story');
      if (isPublicForm) {
        await usePublicFormDataFetch(projectId, save, cacheKey, setFormData);
      } else {
        await useAuthenticatedFormDataFetch(projectId, save, cacheKey, setFormData);
      }
    } catch (error) {
      console.error(`useFormDataLoader: Error refreshing form data for ${projectId}:`, error);
      setFormData((prev) => ({ ...prev, isLoading: false }));
    } finally {
      setRefreshCounter(0);
    }
  };

  const reloadFromRemote = async () => {
    if (!projectId) return;
    
    console.log(`useFormDataLoader: Forcing reload from remote for project ${projectId}`);
    setFormData((prev) => ({ ...prev, isLoading: true }));
    clear();
    doClearSessionCache();
    clearLastLoadedProjectId(); // Clear the last loaded project ID to force a refresh
    setRefreshCounter((prev) => prev + 1);
  };

  return {
    ...formData,
    fetchProjectFormData,
    fetchLocalFormData,
    handleFetchError,
    refreshFormData,
    reloadFromRemote,
  };
};
