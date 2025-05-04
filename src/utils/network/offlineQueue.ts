
/**
 * Offline operation queuing system
 */

// Types for queue operations
export interface QueuedOperation {
  id: string;
  operation: string;
  payload: any;
  timestamp: number;
  retries?: number;
  priority?: number;
}

// Storage key for the queue
const OFFLINE_QUEUE_KEY = 'app_offline_queue';

/**
 * Add an operation to the offline queue
 */
export const addToOfflineQueue = (
  operation: string, 
  payload: any,
  options: { priority?: number } = {}
): string => {
  try {
    const queue = getOfflineQueue();
    
    // Generate a unique ID for this operation
    const id = `${operation}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Create the operation object
    const queuedOperation: QueuedOperation = {
      id,
      operation,
      payload,
      timestamp: Date.now(),
      retries: 0,
      priority: options.priority || 1
    };
    
    // Add to queue
    queue.push(queuedOperation);
    
    // Sort by priority (higher numbers first)
    queue.sort((a, b) => (b.priority || 0) - (a.priority || 0));
    
    // Save back to storage
    saveOfflineQueue(queue);
    
    console.log(`Operation [${operation}] added to offline queue with ID [${id}]`);
    return id;
  } catch (error) {
    console.error('Failed to add operation to offline queue:', error);
    return '';
  }
};

/**
 * Get the current offline queue
 */
export const getOfflineQueue = (): QueuedOperation[] => {
  try {
    const queueJson = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  } catch (error) {
    console.error('Failed to get offline queue:', error);
    return [];
  }
};

/**
 * Save the queue to storage
 */
export const saveOfflineQueue = (queue: QueuedOperation[]): void => {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to save offline queue:', error);
  }
};

/**
 * Process the offline queue
 * @param processors Map of operation processors keyed by operation name
 * @returns Number of operations successfully processed
 */
export const processOfflineQueue = async (
  processors: Record<string, (payload: any) => Promise<boolean>>
): Promise<number> => {
  const queue = getOfflineQueue();
  
  if (queue.length === 0) {
    return 0;
  }
  
  console.log(`Processing offline queue with ${queue.length} operations`);
  
  let successCount = 0;
  const remainingQueue: QueuedOperation[] = [];
  
  // Process each operation in the queue
  for (const operation of queue) {
    const processor = processors[operation.operation];
    
    if (!processor) {
      console.warn(`No processor found for operation [${operation.operation}]`);
      remainingQueue.push(operation);
      continue;
    }
    
    try {
      const success = await processor(operation.payload);
      
      if (success) {
        successCount++;
        console.log(`Successfully processed offline operation [${operation.id}]`);
      } else {
        // Increment retry count and push back to queue
        operation.retries = (operation.retries || 0) + 1;
        remainingQueue.push(operation);
        console.warn(`Failed to process offline operation [${operation.id}], will retry later`);
      }
    } catch (error) {
      // Increment retry count and push back to queue
      operation.retries = (operation.retries || 0) + 1;
      remainingQueue.push(operation);
      console.error(`Error processing offline operation [${operation.id}]:`, error);
    }
  }
  
  // Save the remaining queue
  saveOfflineQueue(remainingQueue);
  
  console.log(`Processed ${successCount} offline operations, ${remainingQueue.length} remaining`);
  return successCount;
};

/**
 * Remove a specific operation from the queue
 */
export const removeFromOfflineQueue = (id: string): boolean => {
  try {
    const queue = getOfflineQueue();
    const initialLength = queue.length;
    
    const filteredQueue = queue.filter(op => op.id !== id);
    
    if (filteredQueue.length < initialLength) {
      saveOfflineQueue(filteredQueue);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Failed to remove operation ${id} from offline queue:`, error);
    return false;
  }
};

/**
 * Clear the entire offline queue
 */
export const clearOfflineQueue = (): void => {
  try {
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    console.log('Offline queue cleared');
  } catch (error) {
    console.error('Failed to clear offline queue:', error);
  }
};

/**
 * Get the number of operations in the queue
 */
export const getOfflineQueueSize = (): number => {
  return getOfflineQueue().length;
};
