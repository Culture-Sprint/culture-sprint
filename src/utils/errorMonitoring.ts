import { logError } from "./errorLogging";
import { handleError } from "./errorHandling";

/**
 * Sets up global error listeners for uncaught exceptions and unhandled rejections
 */
export function setupGlobalErrorListeners() {
  if (typeof window === 'undefined') return;

  // Keep references to original handlers
  const originalOnError = window.onerror;
  const originalOnUnhandledRejection = window.onunhandledrejection;

  // Handle uncaught errors
  window.onerror = function(message, source, lineno, colno, error) {
    const errorInfo = {
      message: String(message),
      source,
      lineno,
      colno
    };

    logError(error || message, "Uncaught error", {
      category: 'unknown',
      source: 'client',
      metadata: errorInfo,
      severity: 'error',
      report: true,
    });

    // Call original handler if it exists
    if (typeof originalOnError === 'function') {
      return originalOnError.apply(this, [message, source, lineno, colno, error]);
    }
    
    // Return false to indicate the error wasn't handled
    return false;
  };

  // Handle unhandled promise rejections
  window.onunhandledrejection = function(event) {
    const error = event.reason;
    
    logError(error, "Unhandled promise rejection", {
      category: 'unknown',
      source: 'client',
      metadata: {
        promiseRejection: true
      },
      severity: 'error',
      report: true,
    });

    // Call original handler if it exists
    if (typeof originalOnUnhandledRejection === 'function') {
      return originalOnUnhandledRejection.apply(this, [event]);
    }
  };

  console.info("Global error monitoring initialized");

  return () => {
    // Cleanup function to restore original handlers
    window.onerror = originalOnError;
    window.onunhandledrejection = originalOnUnhandledRejection;
  };
}

/**
 * Measures performance of critical operations and reports if they exceed thresholds
 */
export function monitorPerformance(
  operation: () => any, 
  operationName: string, 
  threshold: number = 1000
) {
  const start = performance.now();
  try {
    const result = operation();
    const duration = performance.now() - start;
    
    if (duration > threshold) {
      console.warn(`Performance warning: ${operationName} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`);
      
      // Log as a performance issue
      logError(
        new Error(`Performance threshold exceeded`),
        `Slow operation detected: ${operationName}`,
        {
          severity: 'warning',
          category: 'performance',
          metadata: {
            operationName,
            duration,
            threshold
          },
          report: duration > threshold * 2 // Only report if significantly over threshold
        }
      );
    }
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    
    // Log both the error and performance data
    logError(error, `Error in ${operationName}`, {
      severity: 'error',
      category: 'performance',
      metadata: {
        operationName,
        duration,
        threshold
      }
    });
    
    throw error;
  }
}
