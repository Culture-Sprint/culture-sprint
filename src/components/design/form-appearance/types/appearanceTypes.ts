
/**
 * Types for appearance data and validation
 */

import { FormAppearance } from '../types';

// Generic type for appearance data that can be validated
export type AppearanceData = Record<string, any>;

// Type for validation result
export interface ValidationResult {
  valid: boolean;
  appearance?: FormAppearance;
  error?: string;
}

// Type for appearance change options
export interface AppearanceChangeOptions {
  updateUI: boolean;
  notifyUser: boolean;
}
