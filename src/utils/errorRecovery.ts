
/**
 * Utilities for testing and implementing error recovery paths
 */

import { ErrorCategory } from "./errorLogging";
import { isOnline } from "./network/connectionMonitor";
import { addToOfflineQueue } from "./network/offlineQueue";

/**
 * Represents a recovery strategy for different error types
 */
export interface RecoveryStrategy {
  retryCount: number;
  timeout: number;
  fallbackValue?: any;
  onBeforeRetry?: () => void;
  shouldRetry?: (error: Error, attempt: number) => boolean;
  offlineStrategy?: 'queue' | 'fallback' | 'fail';
  offlineQueueOptions?: {
    operationType: string;
    priority?: number;
  };
}

// Default recovery strategies by error category
const defaultRecoveryStrategies: Record<ErrorCategory | 'default', RecoveryStrategy> = {
  network: { 
    retryCount: 3, 
    timeout: 1000,
    shouldRetry: (error) => {
      // Don't retry on 4xx errors (except 408 Request Timeout)
      if ((error as any).status && 
          (error as any).status >= 400 && 
          (error as any).status < 500 && 
          (error as any).status !== 408) {
        return false;
      }
      return true;
    },
    offlineStrategy: 'queue'
  },
  api: { 
    retryCount: 2, 
    timeout: 1000,
    shouldRetry: (error) => {
      // Don't retry on certain API errors
      if ((error as any).code === 'invalid_request' || (error as any).code === 'not_found') {
        return false;
      }
      return true;
    },
    offlineStrategy: 'queue'
  },
  auth: { 
    retryCount: 1, 
    timeout: 0,
    shouldRetry: (error) => {
      // Only retry on token expiration, not invalid credentials
      return (error as any).code === 'token_expired';
    },
    offlineStrategy: 'fail' // Authentication requires online
  },
  data: { 
    retryCount: 2, 
    timeout: 500,
    fallbackValue: [],
    offlineStrategy: 'fallback'
  },
  ui: { 
    retryCount: 1, 
    timeout: 0,
    fallbackValue: null,
    offlineStrategy: 'fallback'
  },
  visualization: { 
    retryCount: 1, 
    timeout: 0,
    fallbackValue: null,
    offlineStrategy: 'fallback'
  },
  input: { 
    retryCount: 0, 
    timeout: 0,
    fallbackValue: null
  },
  storage: { 
    retryCount: 2, 
    timeout: 1000,
    offlineStrategy: 'queue'
  },
  performance: { 
    retryCount: 1, 
    timeout: 2000 
  },
  unknown: { 
    retryCount: 1, 
    timeout: 500 
  },
  default: { 
    retryCount: 1, 
    timeout: 1000 
  }
};

/**
 * Sleep for the specified time
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Handle operation when device is offline
 * @returns Whether the operation was handled
 */
const handleOfflineOperation = <T>(
  fn: () => Promise<T>,
  strategy: RecoveryStrategy,
  fnArgs?: any[]
): { handled: boolean; result?: T; error?: Error } => {
  if (!isOnline()) {
    console.log(`Device is offline - handling according to strategy: ${strategy.offlineStrategy}`);
    
    switch (strategy.offlineStrategy) {
      case 'queue':
        if (strategy.offlineQueueOptions?.operationType) {
          const payload = {
            fn: fn.toString(), // Store function as string (limited utility)
            args: fnArgs || []
          };
          
          addToOfflineQueue(
            strategy.offlineQueueOptions.operationType,
            payload,
            { priority: strategy.offlineQueueOptions.priority || 1 }
          );
          
          console.log(`Operation queued for offline processing with type: ${strategy.offlineQueueOptions.operationType}`);
          return { handled: true };
        }
        
        console.warn('Queue strategy specified but no operationType provided');
        return { handled: false };
        
      case 'fallback':
        if (strategy.fallbackValue !== undefined) {
          console.log(`Using fallback value for offline operation`);
          return { handled: true, result: strategy.fallbackValue };
        }
        
        console.warn('Fallback strategy specified but no fallbackValue provided');
        return { handled: false };
        
      case 'fail':
        const error = new Error('Operation cannot be performed while offline');
        (error as any).isOfflineError = true;
        return { handled: true, error };
        
      default:
        return { handled: false };
    }
  }
  
  return { handled: false };
};

/**
 * Wraps an async function with retry logic based on the provided strategy
 */
export const withRetry = <T>(
  fn: () => Promise<T>,
  category: ErrorCategory | 'default' = 'default',
  customStrategy?: Partial<RecoveryStrategy>
): Promise<T> => {
  const strategy = {
    ...defaultRecoveryStrategies[category] || defaultRecoveryStrategies.default,
    ...customStrategy
  };
  
  return new Promise<T>(async (resolve, reject) => {
    // First, check if we're offline and handle accordingly
    const offlineResult = handleOfflineOperation(fn, strategy);
    if (offlineResult.handled) {
      if (offlineResult.error) {
        reject(offlineResult.error);
      } else if (offlineResult.result !== undefined) {
        resolve(offlineResult.result);
      } else {
        // Operation was queued, treat as success with undefined result
        resolve(undefined as unknown as T);
      }
      return;
    }
    
    let attempts = 0;
    
    const attempt = async (): Promise<void> => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        attempts++;
        
        const shouldRetry = strategy.shouldRetry 
          ? strategy.shouldRetry(error instanceof Error ? error : new Error(String(error)), attempts)
          : attempts <= strategy.retryCount;
        
        if (attempts <= strategy.retryCount && shouldRetry) {
          console.log(`Recovery attempt ${attempts} for ${category} error. Retrying in ${strategy.timeout}ms.`);
          
          if (strategy.onBeforeRetry) {
            strategy.onBeforeRetry();
          }
          
          await sleep(strategy.timeout);
          return attempt();
        } else if (strategy.fallbackValue !== undefined) {
          console.log(`Recovery failed after ${attempts} attempts. Using fallback value.`);
          resolve(strategy.fallbackValue);
        } else {
          reject(error);
        }
      }
    };
    
    return attempt();
  });
};

/**
 * Creates a recoverable version of an async function
 */
export const createRecoverable = <T>(
  fn: () => Promise<T>,
  category: ErrorCategory | 'default' = 'default',
  customStrategy?: Partial<RecoveryStrategy>
) => {
  return () => withRetry(fn, category, customStrategy);
};

/**
 * Test a recovery path with a simulated error
 */
export const testRecoveryPath = async <T>(
  successFn: () => Promise<T>,
  errorFn: () => Promise<T>,
  category: ErrorCategory | 'default' = 'default',
  customStrategy?: Partial<RecoveryStrategy>
): Promise<{ success: boolean; attempts: number; result?: T; error?: Error }> => {
  let attempts = 0;
  
  // Override the shouldRetry function to track attempts and switch to success function
  const testStrategy: Partial<RecoveryStrategy> = {
    ...customStrategy,
    shouldRetry: () => true,
    onBeforeRetry: () => {
      attempts++;
    }
  };
  
  try {
    // First call will use the error function, retries will use success function
    const result = await withRetry(
      () => attempts === 0 ? errorFn() : successFn(),
      category,
      testStrategy
    );
    
    return {
      success: true,
      attempts: attempts + 1, // +1 because first attempt isn't counted in attempts
      result
    };
  } catch (error) {
    return {
      success: false,
      attempts: attempts + 1,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
};
