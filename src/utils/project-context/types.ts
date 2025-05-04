
/**
 * Types for project context utilities
 */

/**
 * Props for building project context
 */
export interface ProjectContextProps {
  projectName: string;
  projectDescription?: string;
  storyData?: {
    storyCount: number;
    sentiments: {
      positive: number;
      neutral: number;
      negative: number;
    };
    avgImpact: number | string;
    sliderQuestions?: string[];
    hasSliderData?: boolean;
  };
  activityResponses?: Record<string, any>;
  id?: string;
}

/**
 * Activity response data structure
 */
export interface ActivityResponse {
  data?: any;
  ar_response?: any;
  [key: string]: any;
}

/**
 * Form data cache identifiers
 */
export interface FormCacheIdentifiers {
  cacheKey: string;
  timestampKey: string;
}
