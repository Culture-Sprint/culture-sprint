
import React from "react";

export const useFormPerformanceDebug = (
  isSuperAdmin: boolean,
  projectId?: string | null
) => {
  const performanceMarkers = React.useMemo(
    () => ({
      startTime: performance.now(),
      storyQuestionTime: 0,
      sliderQuestionsTime: 0,
      participantQuestionsTime: 0,
    }),
    []
  );

  const logPerformance = React.useCallback(() => {
    if (isSuperAdmin && projectId && process.env.NODE_ENV === 'development') {
      const totalTime = performance.now() - performanceMarkers.startTime;
      console.group(
        "%c🚀 Form Data Loading Performance",
        "color: blue; font-weight: bold"
      );
      console.log("Total Load Time:", `${totalTime.toFixed(2)}ms`);
      console.log(
        "Story Question Fetch:",
        `${performanceMarkers.storyQuestionTime.toFixed(2)}ms`
      );
      console.log(
        "Slider Questions Fetch:",
        `${performanceMarkers.sliderQuestionsTime.toFixed(2)}ms`
      );
      console.log(
        "Participant Questions Fetch:",
        `${performanceMarkers.participantQuestionsTime.toFixed(2)}ms`
      );
      console.groupEnd();
    }
  }, [isSuperAdmin, projectId, performanceMarkers]);

  React.useEffect(() => {
    if (isSuperAdmin && projectId && process.env.NODE_ENV === 'development') {
      (window as any).__performanceMarkers = performanceMarkers;
      (window as any).__logFormPerformance = logPerformance;
    }

    // Cleanup function to remove debug objects when unmounting
    return () => {
      if (process.env.NODE_ENV === 'development') {
        delete (window as any).__performanceMarkers;
        delete (window as any).__logFormPerformance;
      }
    };
  }, [isSuperAdmin, projectId, performanceMarkers, logPerformance]);

  return { performanceMarkers, logPerformance };
};
