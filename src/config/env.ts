
/**
 * Environment configuration
 * This file centralizes all environment variables used in the application
 */
import { validateEnv, getEnvVar } from "@/utils/envValidator";
import { createEnvValidationError } from "@/types/errors";

// Required environment variables
const REQUIRED_VARS = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

// Validate required environment variables
export const envValidation = validateEnv(REQUIRED_VARS);

// Track if validation has been run
let validationPerformed = false;

/**
 * Validates the environment and throws if required variables are missing
 * @throws {EnvValidationError} If required variables are missing
 */
export function validateEnvironment(): void {
  validationPerformed = true;
  if (!envValidation.isValid) {
    throw createEnvValidationError(envValidation.missingVars);
  }
}

/**
 * Environment variables with validation
 * Uses defaults for development only, which should be overridden in production
 */
const ENV = {
  // Supabase configuration - throw error if missing in production
  SUPABASE_URL: getEnvVar('VITE_SUPABASE_URL', undefined, import.meta.env.PROD),
  SUPABASE_ANON_KEY: getEnvVar('VITE_SUPABASE_ANON_KEY', undefined, import.meta.env.PROD),
  
  // Application settings
  NODE_ENV: import.meta.env.MODE || "development",
  IS_PRODUCTION: import.meta.env.PROD || false,
  
  // Feature flags
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === "true" || false,
  
  // Check environment on export
  ensureValid(): void {
    if (!validationPerformed) {
      validateEnvironment();
    }
  }
};

// Run validation in production
if (import.meta.env.PROD) {
  validateEnvironment();
}

export default ENV;
