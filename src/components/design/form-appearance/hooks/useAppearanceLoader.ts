
import { validateAppearanceData } from "../utils/appearanceValidation";
import { FormAppearance, defaultAppearance } from "../types";

interface UseAppearanceLoaderProps {
  projectId?: string;
  setAppearance: (appearance: FormAppearance) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  isEditing: React.MutableRefObject<boolean>;
  fetchActivityResponse: (phaseId: string, stepId: string, activityId: string, forceRefresh?: boolean) => Promise<any>;
  validateAppearanceData: (data: any) => FormAppearance;
}

export const useAppearanceLoader = ({
  projectId,
  setAppearance,
  setIsLoading,
  setError,
  isEditing,
  fetchActivityResponse,
  validateAppearanceData
}: UseAppearanceLoaderProps) => {
  
  const loadAppearance = async (forceRefresh = false): Promise<boolean> => {
    if (!projectId) {
      console.error("Cannot load appearance without a project ID");
      setError("Project ID is required");
      return false;
    }
    
    // Don't reload if we're currently editing to prevent losing changes
    if (isEditing.current && !forceRefresh) {
      console.log("Skipping appearance load because we're currently editing");
      return false;
    }
    
    try {
      setIsLoading(true);
      console.log("Loading form appearance for project:", projectId);
      
      // IMPORTANT: Always load from the build phase for form appearance
      // This is the only location where form appearance data should be stored
      const response = await fetchActivityResponse('build', 'form-appearance', 'form-appearance-editor', forceRefresh);
      
      if (response) {
        console.log("Loaded form appearance from 'build' phase:", response);
        
        // Validate and sanitize the response data
        const validatedAppearance = validateAppearanceData(response);
        setAppearance(validatedAppearance);
        setError(null);
        return true;
      } else {
        console.log("No form appearance found in 'build' phase, using defaults");
        setAppearance({ ...defaultAppearance });
        return false;
      }
    } catch (err) {
      console.error("Error loading form appearance:", err);
      setError("Error loading form appearance: " + (err instanceof Error ? err.message : "Unknown error"));
      setAppearance({ ...defaultAppearance });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return { loadAppearance };
};
