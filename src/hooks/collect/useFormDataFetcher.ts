
import { useState, useEffect } from "react";
import { useFormDataFetch } from "./form-load/useFormDataFetch";
import { FormDataState } from "@/types/formTypes";

export const useFormDataFetcher = (projectId: string | null) => {
  const [formData, setFormData] = useState<FormDataState>({
    storyQuestion: "",
    sliderQuestions: [],
    participantQuestions: [],
    isLoading: true,
    formDesigned: false
  });

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { fetchProjectFormData, fetchLocalFormData, handleFetchError } = useFormDataFetch();

  useEffect(() => {
    const overallStart = performance.now();
    const logTag = `[FormDataFetcher][${projectId ?? "NoProject"}][Refresh:${refreshTrigger}]`;

    console.groupCollapsed(`${logTag} 🚦 Form Data Fetch - BEGIN`);
    console.time(`${logTag} [OVERALL] Total Form Data Fetch`);

    console.log(`${logTag} useFormDataFetcher triggered`, {
      projectId,
      refreshTrigger,
      time: new Date().toISOString()
    });

    // Generate a cache key for this fetch
    const cacheKey = projectId ? 
      `form_data_fetch_${projectId}_${refreshTrigger}` : 
      `form_data_fetch_local_${refreshTrigger}`;
    
    // Check if we have this in sessionStorage for very fast navigation
    const sessionCached = sessionStorage.getItem(cacheKey);
    if (sessionCached && refreshTrigger === 0) {
      try {
        const cachedData = JSON.parse(sessionCached);
        console.log(`${logTag} [CACHE] Found session cached data, using it`);
        setFormData({
          ...cachedData,
          isLoading: false
        });
        console.timeEnd(`${logTag} [OVERALL] Total Form Data Fetch`);
        console.groupEnd();
        return;
      } catch (e) {
        console.log(`${logTag} [CACHE] Session cache parse error, continuing with fetch`);
      }
    }

    const fetchData = async () => {
      if (!projectId) {
        const localStart = performance.now();
        console.log(`${logTag} [LOCAL] No projectId provided. Using local/default form data.`);
        try {
          const defaultData = await fetchLocalFormData();
          setFormData({
            ...defaultData,
            isLoading: false
          });
          
          // Cache in sessionStorage for fast navigation
          sessionStorage.setItem('form_data_fetch_local_0', JSON.stringify(defaultData));
          
          const localDuration = performance.now() - localStart;
          console.log(`${logTag} [LOCAL] Local form data loaded in ${localDuration.toFixed(2)}ms`);
        } catch (err) {
          console.error(`${logTag} [ERROR][LOCAL] Error loading local form data:`, err);
        } finally {
          console.timeEnd(`${logTag} [OVERALL] Total Form Data Fetch`);
          console.groupEnd();
        }
        return;
      }

      let fetchStageStart = performance.now();
      try {
        console.group(`${logTag} [REMOTE] Fetching form components`);

        // 1. Fetch core form data pieces separately and time individually for granular insight
        let result: any = {};
        // Story Question
        let t0 = performance.now();
        console.time(`${logTag} [STAGE] Fetch Story Question`);
        result.storyQuestion = undefined;
        try {
          const projectData = await fetchProjectFormData(projectId);
          Object.assign(result, projectData);
          
          // Cache successful project data for fast navigation
          sessionStorage.setItem(cacheKey, JSON.stringify(projectData));
        } finally {
          const t1 = performance.now();
          console.timeEnd(`${logTag} [STAGE] Fetch Story Question`);
          console.log(`${logTag} [STAGE] Story Question fetch = ${(t1 - t0).toFixed(2)}ms`);
        }

        // (Assume fetchProjectFormData fetches all 3: story, sliders, participants - log that)
        console.log(`${logTag} [SUMMARY] Data fetch result:`, {
          storyQ: !!result.storyQuestion,
          sliders: Array.isArray(result.sliderQuestions) ? result.sliderQuestions.length : "n/a",
          participants: Array.isArray(result.participantQuestions) ? result.participantQuestions.length : "n/a"
        });

        setFormData({
          ...result,
          isLoading: false
        });

        const fetchStageEnd = performance.now();
        console.log(`${logTag} [SUCCESS] All project form data fetched in ${(fetchStageEnd - fetchStageStart).toFixed(2)}ms`);
        console.groupEnd();
      } catch (error) {
        const fetchStageEnd = performance.now();
        console.error(`${logTag} [ERROR][REMOTE] Fetching failed after ${(fetchStageEnd - fetchStageStart).toFixed(2)}ms:`, error);
        const errorData = handleFetchError(error);
        setFormData({
          ...errorData,
          isLoading: false
        });
      } finally {
        const overallEnd = performance.now();
        console.timeEnd(`${logTag} [OVERALL] Total Form Data Fetch`);
        console.log(`${logTag} [COMPLETE] useFormDataFetcher duration: ${(overallEnd - overallStart).toFixed(2)}ms`);
        console.groupEnd();
      }
    };

    fetchData();
  }, [projectId, refreshTrigger]);

  const reloadFromRemote = () => {
    if (!projectId) return;

    console.log(`[FormDataFetcher][${projectId}] Forcing remote reload...`);
    // Clear session cache for this project to ensure fresh data
    const cacheKeyPattern = `form_data_fetch_${projectId}_`;
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(cacheKeyPattern)) {
        sessionStorage.removeItem(key);
      }
    });
    
    setFormData(prev => ({ ...prev, isLoading: true }));
    setRefreshTrigger(prev => prev + 1);
  };

  return {
    ...formData,
    reloadFromRemote
  };
};
