
/**
 * Custom error types for the application
 */

/**
 * Environment validation error
 */
export interface EnvValidationError extends Error {
  code: 'ENV_VALIDATION_ERROR';
  missingVars: string[];
}

/**
 * Creates an environment validation error
 */
export function createEnvValidationError(missingVars: string[]): EnvValidationError {
  const error = new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  ) as EnvValidationError;
  
  error.name = 'EnvValidationError';
  error.code = 'ENV_VALIDATION_ERROR';
  error.missingVars = missingVars;
  
  return error;
}
