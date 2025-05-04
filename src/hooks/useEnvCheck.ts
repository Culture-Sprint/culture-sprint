
import { useState, useEffect } from "react";
import { envValidation, validateEnvironment } from "@/config/env";
import { EnvValidationError, createEnvValidationError } from "@/types/errors";

/**
 * Hook for checking environment variable configuration
 */
export function useEnvCheck() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<EnvValidationError | null>(null);
  
  useEffect(() => {
    try {
      // Attempt to validate environment
      if (!envValidation.isValid) {
        setError(createEnvValidationError(envValidation.missingVars));
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(createEnvValidationError(
          envValidation.missingVars || ['Unknown error validating environment']
        ));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    isEnvironmentValid: !error && !isLoading,
    isLoading,
    error,
    envValidation
  };
}
