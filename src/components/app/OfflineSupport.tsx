
import React, { useEffect } from 'react';
import { initConnectionMonitoring } from '@/utils/network/connectionMonitor';
import { initOfflineQueueProcessor } from '@/utils/network/offlineQueueProcessor';

/**
 * Component that initializes offline support features
 * This should be included near the root of your application
 */
export const OfflineSupport: React.FC = () => {
  useEffect(() => {
    // Initialize connection monitoring
    initConnectionMonitoring();
    
    // Initialize offline queue processor
    initOfflineQueueProcessor();
    
    return () => {
      // Nothing to clean up for connection monitoring as it's using native browser events
      // Stop the offline queue processor
      // stopOfflineQueueProcessor();
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default OfflineSupport;
