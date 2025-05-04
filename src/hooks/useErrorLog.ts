
import { useCallback } from "react";
import { logError, ErrorCategory } from "@/utils/errorLogging";
import { ErrorSeverity } from "@/utils/errorHandling";

/**
 * Hook for logging errors within functional components
 * 
 * @param componentName The name of the component using the hook
 * @param defaultCategory Default category for logged errors
 */
export function useErrorLog(componentName: string, defaultCategory: ErrorCategory = 'ui') {
  const logComponentError = useCallback(
    (
      error: unknown,
      message?: string,
      options?: {
        severity?: ErrorSeverity;
        category?: ErrorCategory;
        metadata?: Record<string, any>;
        userAction?: string;
        report?: boolean;
      }
    ) => {
      return logError(error, message || `Error in ${componentName}`, {
        componentName,
        category: options?.category || defaultCategory,
        severity: options?.severity || 'error',
        metadata: options?.metadata,
        userAction: options?.userAction,
        report: options?.report
      });
    },
    [componentName, defaultCategory]
  );

  /**
   * Creates a wrapper for functions to catch and log errors
   */
  const createErrorWrapper = useCallback(
    (
      options?: {
        message?: string;
        severity?: ErrorSeverity;
        category?: ErrorCategory;
        metadata?: Record<string, any>;
        rethrow?: boolean;
      }
    ) => {
      return <T extends (...args: any[]) => any>(fn: T) => {
        return (...args: Parameters<T>): ReturnType<T> | undefined => {
          try {
            const result = fn(...args);
            
            // Handle promise results
            if (result instanceof Promise) {
              return result.catch((error) => {
                logComponentError(error, options?.message, {
                  severity: options?.severity,
                  category: options?.category,
                  metadata: options?.metadata
                });
                
                if (options?.rethrow !== false) {
                  throw error;
                }
                return undefined;
              }) as ReturnType<T>;
            }
            
            return result;
          } catch (error) {
            logComponentError(error, options?.message, {
              severity: options?.severity,
              category: options?.category,
              metadata: options?.metadata
            });
            
            if (options?.rethrow !== false) {
              throw error;
            }
            return undefined;
          }
        };
      };
    },
    [logComponentError]
  );

  /**
   * Wraps a function in a try/catch and logs any errors
   */
  const withErrorLogging = useCallback(
    <T extends (...args: any[]) => any>(
      fn: T,
      options?: {
        message?: string;
        severity?: ErrorSeverity;
        category?: ErrorCategory;
        metadata?: Record<string, any>;
        rethrow?: boolean;
      }
    ) => {
      return createErrorWrapper(options)(fn);
    },
    [createErrorWrapper]
  );

  return {
    logError: logComponentError,
    withErrorLogging,
    createErrorWrapper
  };
}

export default useErrorLog;
