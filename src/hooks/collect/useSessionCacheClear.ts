
/**
 * Utility hook to clear all session cache keys related to a projectId
 */
export function useSessionCacheClear(projectId: string | null) {
  return () => {
    Object.keys(sessionStorage).forEach((key) => {
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
}
