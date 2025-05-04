
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import useConnectionStatus from '@/hooks/useConnectionStatus';

interface OfflineIndicatorProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'badge' | 'banner' | 'status';
}

/**
 * Component that displays the current offline/online status
 */
export function OfflineIndicator({
  className,
  showLabel = true,
  variant = 'badge'
}: OfflineIndicatorProps) {
  const { isOnline, isOffline } = useConnectionStatus();

  // If online and using the status variant, don't show anything
  if (isOnline && variant === 'status') {
    return null;
  }

  if (variant === 'banner' && isOffline) {
    return (
      <div className="w-full bg-amber-500 dark:bg-amber-900 text-white px-4 py-2 flex items-center justify-center space-x-2">
        <WifiOff size={18} />
        <span>You're offline. Limited functionality available.</span>
      </div>
    );
  }

  const badgeClasses = cn(
    "flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors",
    isOnline 
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
      : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
    className
  );

  return (
    <div className={badgeClasses}>
      {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
      {showLabel && (
        <span>{isOnline ? "Online" : "Offline"}</span>
      )}
    </div>
  );
}

export default OfflineIndicator;
