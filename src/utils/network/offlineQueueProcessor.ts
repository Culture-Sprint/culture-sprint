
import { processOfflineQueue, getOfflineQueueSize } from './offlineQueue';
import { CONNECTION_EVENTS } from './connectionMonitor';

// Set of registered processors
const operationProcessors: Record<string, (payload: any) => Promise<boolean>> = {};

/**
 * Register a processor for an operation type
 */
export const registerOfflineProcessor = (
  operationType: string,
  processor: (payload: any) => Promise<boolean>
): void => {
  operationProcessors[operationType] = processor;
  console.log(`Registered offline processor for operation type [${operationType}]`);
};

/**
 * Initialize the offline queue processor
 */
export const initOfflineQueueProcessor = (): void => {
  // Process queue when we come back online
  window.addEventListener(CONNECTION_EVENTS.ONLINE, handleOnline);
  window.addEventListener(CONNECTION_EVENTS.RECONNECTED, handleOnline);
  
  // Initial check if there are pending items
  const queueSize = getOfflineQueueSize();
  if (queueSize > 0) {
    console.log(`Found ${queueSize} pending offline operations at startup`);
  }
};

/**
 * Handle coming back online
 */
const handleOnline = async (): Promise<void> => {
  console.log('Network connection restored - processing offline queue');
  
  const queueSize = getOfflineQueueSize();
  if (queueSize === 0) {
    console.log('No offline operations to process');
    return;
  }
  
  try {
    const processed = await processOfflineQueue(operationProcessors);
    console.log(`Successfully processed ${processed} of ${queueSize} offline operations`);
  } catch (error) {
    console.error('Error processing offline queue:', error);
  }
};

/**
 * Stop the offline queue processor
 */
export const stopOfflineQueueProcessor = (): void => {
  window.removeEventListener(CONNECTION_EVENTS.ONLINE, handleOnline);
  window.removeEventListener(CONNECTION_EVENTS.RECONNECTED, handleOnline);
};

// Export the processors map for testing
export const getRegisteredProcessors = (): Record<string, (payload: any) => Promise<boolean>> => {
  return { ...operationProcessors };
};
