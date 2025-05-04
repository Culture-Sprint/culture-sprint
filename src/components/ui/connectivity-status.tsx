
import React from 'react';
import { WifiOff, CloudOff, UploadCloud, ArrowUpFromLine, CheckCircle2 } from 'lucide-react';
import useConnectionStatus from '@/hooks/useConnectionStatus';
import { getOfflineQueueSize } from '@/utils/network/offlineQueue';
import { Badge } from '@/components/ui/badge';

interface ConnectivityStatusProps {
  className?: string;
  showQueueSize?: boolean;
}

/**
 * Component that displays connectivity status and pending operations
 */
export function ConnectivityStatus({
  className,
  showQueueSize = true
}: ConnectivityStatusProps) {
  const { isOnline, isOffline, connectionStatus } = useConnectionStatus();
  const [queueSize, setQueueSize] = React.useState(0);
  
  // Check offline queue size periodically
  React.useEffect(() => {
    // Initial check
    setQueueSize(getOfflineQueueSize());
    
    // Setup periodic checks
    const intervalId = setInterval(() => {
      setQueueSize(getOfflineQueueSize());
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // If online and no pending operations, show nothing or a subtle indicator
  if (isOnline && queueSize === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
        <CheckCircle2 size={14} />
        <span>All synced</span>
      </div>
    );
  }
  
  // If offline, show offline indicator
  if (isOffline) {
    return (
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <WifiOff size={16} />
        <span className="text-xs">Offline mode</span>
        
        {showQueueSize && queueSize > 0 && (
          <Badge variant="outline" className="ml-2 text-xs">
            {queueSize} pending
          </Badge>
        )}
      </div>
    );
  }
  
  // If online but have pending operations
  if (isOnline && queueSize > 0) {
    return (
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <UploadCloud size={16} className="animate-pulse" />
        <span className="text-xs">Syncing</span>
        <Badge variant="outline" className="ml-2 text-xs">
          {queueSize} pending
        </Badge>
      </div>
    );
  }
  
  // Fallback (shouldn't reach here)
  return null;
}

export default ConnectivityStatus;
