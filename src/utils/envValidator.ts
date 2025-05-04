
/**
 * Utility for validating environment variables
 */

type EnvValidationResult = {
  isValid: boolean;
  missingVars: string[];
  message: string;
};

/**
 * Validates required environment variables
 * @param requiredVars Array of required environment variable names
 * @param envObject The environment object to validate against
 * @returns Validation result with status and missing variables
 */
export function validateEnv(
  requiredVars: string[],
  envObject: Record<string, any> = import.meta.env
): EnvValidationResult {
  const missingVars = requiredVars.filter(
    varName => envObject[varName] === undefined || envObject[varName] === ""
  );
  
  const isValid = missingVars.length === 0;
  
  const message = isValid 
    ? "All required environment variables are present" 
    : `Missing required environment variables: ${missingVars.join(", ")}`;
    
  return {
    isValid,
    missingVars,
    message
  };
}

/**
 * Gets a environment variable with fallback and optional validation
 * @param key The environment variable name
 * @param defaultValue Optional default value
 * @param required Whether the variable is required (throws if missing and no default)
 * @returns The environment variable value or default
 */
export function getEnvVar(
  key: string,
  defaultValue?: string,
  required = false
): string {
  const value = import.meta.env[key] || defaultValue;
  
  if (required && value === undefined) {
    throw new Error(`Required environment variable ${key} is missing`);
  }
  
  return value as string;
}
