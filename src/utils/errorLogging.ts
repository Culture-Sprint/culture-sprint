import { ErrorSeverity, handleError } from "./errorHandling";

// Types for error analytics
export interface ErrorAnalyticsData {
  errorId: string;
  message: string;
  stack?: string;
  componentName?: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: number;
  metadata?: Record<string, any>;
  userAction?: string;
  source: ErrorSource;
}

export type ErrorCategory = 
  | 'api' 
  | 'auth' 
  | 'ui' 
  | 'data' 
  | 'network' 
  | 'visualization' 
  | 'input' 
  | 'storage'
  | 'performance'  // Added 'performance' as a valid category
  | 'unknown';

export type ErrorSource = 
  | 'client'
  | 'server'
  | 'network'
  | 'external';

export type ErrorPriority = 'critical' | 'high' | 'medium' | 'low';

// In-memory store for errors (would be replaced with persistent storage in production)
const errorStore: ErrorAnalyticsData[] = [];

/**
 * Generates a unique ID for each error
 */
function generateErrorId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

/**
 * Determines the category of an error based on its properties and context
 */
export function categorizeError(error: unknown, context?: Record<string, any>): ErrorCategory {
  if (!error) return 'unknown';
  
  const errorStr = String(error);
  
  if (errorStr.includes('network') || errorStr.includes('fetch') || errorStr.includes('http')) {
    return 'network';
  }
  
  if (errorStr.includes('auth') || errorStr.includes('login') || errorStr.includes('permission')) {
    return 'auth';
  }
  
  if (errorStr.includes('render') || errorStr.includes('component') || context?.source === 'react') {
    return 'ui';
  }
  
  if (errorStr.includes('data') || errorStr.includes('query') || errorStr.includes('supabase')) {
    return 'data';
  }
  
  if (errorStr.includes('chart') || errorStr.includes('d3') || errorStr.includes('visualization')) {
    return 'visualization';
  }
  
  if (errorStr.includes('storage') || errorStr.includes('save') || errorStr.includes('cache')) {
    return 'storage';
  }
  
  if (errorStr.includes('input') || errorStr.includes('validation') || errorStr.includes('form')) {
    return 'input';
  }

  if (errorStr.includes('performance') || errorStr.includes('slow') || errorStr.includes('timeout')) {
    return 'performance';
  }
  
  return 'unknown';
}

/**
 * Determines the priority of an error based on its severity and category
 */
export function prioritizeError(
  severity: ErrorSeverity,
  category: ErrorCategory
): ErrorPriority {
  // Critical errors
  if (severity === 'error') {
    if (category === 'auth' || category === 'data' || category === 'network') {
      return 'critical';
    }
    return 'high';
  }
  
  // Warning level errors
  if (severity === 'warning') {
    if (category === 'network' || category === 'data') {
      return 'high';
    }
    return 'medium';
  }
  
  // Info level errors
  return 'low';
}

/**
 * Logs an error to the centralized error store and optionally reports it
 */
export function logError(
  error: unknown,
  message: string = "An error occurred",
  options: {
    severity?: ErrorSeverity;
    componentName?: string;
    category?: ErrorCategory;
    metadata?: Record<string, any>;
    userAction?: string;
    source?: ErrorSource;
    report?: boolean;
  } = {}
): ErrorAnalyticsData {
  const {
    severity = 'error',
    componentName,
    metadata = {},
    userAction,
    source = 'client',
    report = true,
  } = options;
  
  // Determine error details
  const stack = error instanceof Error ? error.stack : undefined;
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  // Determine category (use provided or auto-categorize)
  const category = options.category || categorizeError(error, { componentName, ...metadata });
  
  // Determine priority
  const priority = prioritizeError(severity, category);
  
  // Create error analytics object
  const errorData: ErrorAnalyticsData = {
    errorId: generateErrorId(),
    message: message || errorMessage,
    stack,
    componentName,
    severity,
    category,
    timestamp: Date.now(),
    metadata: {
      ...metadata,
      priority,
      originalError: errorMessage,
    },
    userAction,
    source,
  };
  
  // Store error in memory
  errorStore.push(errorData);
  
  // Log to console for development
  if (process.env.NODE_ENV !== 'production') {
    console.group(`[${severity.toUpperCase()}] ${message}`);
    console.error(error);
    console.info(`Category: ${category}, Priority: ${priority}`);
    if (metadata && Object.keys(metadata).length) {
      console.info('Context:', metadata);
    }
    console.groupEnd();
  }
  
  // Report to external service if needed
  if (report) {
    reportError(errorData);
  }
  
  return errorData;
}

/**
 * Reports an error to external monitoring services
 */
export function reportError(errorData: ErrorAnalyticsData): void {
  // In a real implementation, this would send to services like Sentry, LogRocket, etc.
  // For now we'll just simulate by logging to console in production
  
  if (process.env.NODE_ENV === 'production') {
    // This could be replaced with actual API calls to monitoring services
    console.info('[Error Report]', JSON.stringify(errorData));
    
    // Example of how we would integrate with services like Sentry:
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(errorData.message), {
    //     extra: {
    //       ...errorData.metadata,
    //       category: errorData.category,
    //       severity: errorData.severity,
    //       componentName: errorData.componentName,
    //     },
    //     tags: {
    //       source: errorData.source,
    //       priority: errorData.metadata?.priority,
    //     },
    //     level: errorData.severity === 'error' ? 'error' : 
    //            errorData.severity === 'warning' ? 'warning' : 'info',
    //   });
    // }
  }
}

/**
 * Retrieves all logged errors (for admin dashboards, etc)
 */
export function getLoggedErrors(): ErrorAnalyticsData[] {
  return [...errorStore];
}

/**
 * Clears the error store (for testing/development)
 */
export function clearErrorStore(): void {
  errorStore.length = 0;
}

/**
 * Creates an error handler that logs errors before handling them
 */
export function createLoggingErrorHandler(
  componentName: string,
  options: {
    category?: ErrorCategory;
    metadata?: Record<string, any>;
    severity?: ErrorSeverity;
    showToast?: boolean;
    logToConsole?: boolean;
  } = {}
) {
  return (fn: Function) => {
    return (...args: any[]) => {
      try {
        const result = fn(...args);
        
        // Handle promise results
        if (result instanceof Promise) {
          return result.catch((error) => {
            const errorData = logError(error, `Error in ${componentName}`, {
              componentName,
              category: options.category,
              metadata: options.metadata,
              severity: options.severity || 'error',
            });
            
            // Use existing error handling infrastructure
            handleError(error, errorData.message, {
              showToast: options.showToast ?? true,
              logToConsole: options.logToConsole ?? true,
              severity: errorData.severity,
              context: { errorId: errorData.errorId, ...options.metadata },
            });
            
            throw error; // Re-throw to allow other error handlers to process it
          });
        }
        
        return result;
      } catch (error) {
        const errorData = logError(error, `Error in ${componentName}`, {
          componentName,
          category: options.category,
          metadata: options.metadata,
          severity: options.severity || 'error',
        });
        
        // Use existing error handling infrastructure
        handleError(error, errorData.message, {
          showToast: options.showToast ?? true,
          logToConsole: options.logToConsole ?? true,
          severity: errorData.severity,
          context: { errorId: errorData.errorId, ...options.metadata },
        });
        
        throw error; // Re-throw to allow other error handlers to process it
      }
    };
  };
}
