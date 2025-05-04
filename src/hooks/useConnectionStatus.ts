
import { useState, useEffect, useCallback } from 'react';
import { ConnectionStatus, CONNECTION_EVENTS, getConnectionStatus } from '@/utils/network/connectionMonitor';
import { useToast } from '@/hooks/toast';

interface ConnectionOptions {
  showToasts?: boolean;
  checkServerEndpoint?: string;
  pollingInterval?: number; // in milliseconds
}

/**
 * Hook for monitoring and accessing network connection status
 */
export function useConnectionStatus(options: ConnectionOptions = {}) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(getConnectionStatus());
  const [lastOnlineTime, setLastOnlineTime] = useState<Date | null>(navigator.onLine ? new Date() : null);
  const { toast } = useToast();
  
  const {
    showToasts = true, 
    checkServerEndpoint,
    pollingInterval = 30000 // Default to 30 seconds
  } = options;

  // Update status and show toast notifications
  const updateStatus = useCallback((status: ConnectionStatus) => {
    setConnectionStatus(status);
    
    if (showToasts) {
      if (status === 'offline') {
        toast({
          title: "You're offline",
          description: "Working in offline mode. Changes will be saved when you reconnect.",
          variant: "warning",
          duration: 5000
        });
      } else if (status === 'reconnecting') {
        toast({
          title: "Reconnecting...",
          description: "Attempting to reconnect to the server.",
          variant: "default"
        });
      } else if (status === 'online') {
        toast({
          title: "You're back online",
          description: "Connection restored. Syncing data...",
          variant: "success",
          duration: 3000
        });
        // Update last online time
        setLastOnlineTime(new Date());
      }
    }
  }, [showToasts, toast]);

  // Listen for connection events
  useEffect(() => {
    const handleOnline = () => updateStatus('online');
    const handleOffline = () => updateStatus('offline');
    const handleReconnected = () => updateStatus('online');
    
    window.addEventListener(CONNECTION_EVENTS.ONLINE, handleOnline);
    window.addEventListener(CONNECTION_EVENTS.OFFLINE, handleOffline);
    window.addEventListener(CONNECTION_EVENTS.RECONNECTED, handleReconnected);
    
    // Initial status
    updateStatus(getConnectionStatus());
    
    return () => {
      window.removeEventListener(CONNECTION_EVENTS.ONLINE, handleOnline);
      window.removeEventListener(CONNECTION_EVENTS.OFFLINE, handleOffline);
      window.removeEventListener(CONNECTION_EVENTS.RECONNECTED, handleReconnected);
    };
  }, [updateStatus]);

  // Periodically check connection to server if endpoint is provided
  useEffect(() => {
    if (!checkServerEndpoint) return;
    
    const checkServer = async () => {
      if (!navigator.onLine) return;
      
      try {
        const response = await fetch(checkServerEndpoint, {
          method: 'HEAD',
          cache: 'no-store',
          mode: 'no-cors'
        });
        
        if (connectionStatus !== 'online') {
          updateStatus('online');
        }
      } catch (error) {
        if (connectionStatus !== 'offline') {
          updateStatus('offline');
        }
      }
    };
    
    const intervalId = setInterval(checkServer, pollingInterval);
    return () => clearInterval(intervalId);
  }, [checkServerEndpoint, connectionStatus, pollingInterval, updateStatus]);
  
  return {
    isOnline: connectionStatus === 'online',
    isOffline: connectionStatus === 'offline',
    connectionStatus,
    lastOnlineTime
  };
}

export default useConnectionStatus;
