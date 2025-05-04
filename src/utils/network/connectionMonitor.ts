
/**
 * Network connectivity monitoring utilities
 */

// Event names for network status changes
export const CONNECTION_EVENTS = {
  ONLINE: 'app:online',
  OFFLINE: 'app:offline',
  RECONNECTED: 'app:reconnected',
} as const;

// Connection status types
export type ConnectionStatus = 'online' | 'offline' | 'reconnecting';

/**
 * Initializes the network connection monitoring
 */
export const initConnectionMonitoring = (): void => {
  let wasOffline = false;
  
  // Listen for online events
  window.addEventListener('online', () => {
    if (wasOffline) {
      // We were offline but now reconnected
      wasOffline = false;
      dispatchConnectionEvent(CONNECTION_EVENTS.RECONNECTED);
      console.log('✅ Network connection restored');
    } else {
      dispatchConnectionEvent(CONNECTION_EVENTS.ONLINE);
    }
  });
  
  // Listen for offline events
  window.addEventListener('offline', () => {
    wasOffline = true;
    dispatchConnectionEvent(CONNECTION_EVENTS.OFFLINE);
    console.log('❌ Network connection lost');
  });
  
  // Initial check
  if (!navigator.onLine) {
    wasOffline = true;
    dispatchConnectionEvent(CONNECTION_EVENTS.OFFLINE);
    console.log('❌ App started in offline mode');
  }
};

/**
 * Dispatch a custom event for connection status changes
 */
export const dispatchConnectionEvent = (eventType: string): void => {
  window.dispatchEvent(new CustomEvent(eventType));
};

/**
 * Get the current connection status
 */
export const getConnectionStatus = (): ConnectionStatus => {
  return navigator.onLine ? 'online' : 'offline';
};

/**
 * Check if the device is currently online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Utility to check connection with optional server ping
 */
export const checkConnection = async (pingUrl?: string): Promise<boolean> => {
  // First check the browser's navigator.onLine property
  if (!navigator.onLine) {
    return false;
  }
  
  // If no ping URL is provided, just return the navigator.onLine result
  if (!pingUrl) {
    return true;
  }
  
  // Try to fetch a small resource from the server to confirm connection
  try {
    const response = await fetch(pingUrl, {
      method: 'HEAD',
      cache: 'no-store',
      mode: 'no-cors',
      timeout: 3000
    } as RequestInit);
    
    return true; // If we get here, we're online
  } catch (error) {
    console.warn('Connection check failed:', error);
    return false;
  }
};
