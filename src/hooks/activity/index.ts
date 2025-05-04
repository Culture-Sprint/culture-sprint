
import { useActivityResponsesCore } from './useActivityResponsesCore';
import { useActivityResponsesFetch } from './useActivityResponsesFetch';
import { useActivityResponsesSave } from './useActivityResponsesSave';

/**
 * Combined hook for activity responses with both fetch and save functionality
 */
export const useActivityResponses = (projectId: string) => {
  const { fetchActivityResponse, loading } = useActivityResponsesFetch(projectId);
  const { saveActivityResponse, saving } = useActivityResponsesSave(projectId);

  return {
    fetchActivityResponse,
    saveActivityResponse,
    loading,
    saving
  };
};

export { useActivityResponsesCore, useActivityResponsesFetch, useActivityResponsesSave };
