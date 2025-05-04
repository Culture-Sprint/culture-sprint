
import React, { ComponentType, useState, useEffect } from 'react';
import useConnectionStatus from '@/hooks/useConnectionStatus';
import { OfflineIndicator } from '@/components/ui/offline-indicator';
import { FormErrorFallback } from '@/components/ui/form-error-fallback';

interface WithOfflineFallbackOptions {
  fallbackComponent?: React.FC<any>;
  offlineMessage?: string;
  attemptFetchWhenOffline?: boolean;
  criticalComponent?: boolean;
}

/**
 * Higher-order component that provides offline fallback
 */
export function withOfflineFallback<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithOfflineFallbackOptions = {}
) {
  const {
    fallbackComponent,
    offlineMessage = "This component requires internet connection to work properly. Some features may be limited.",
    attemptFetchWhenOffline = false,
    criticalComponent = false,
  } = options;

  const ComponentWithOfflineFallback = (props: P) => {
    const { isOffline, isOnline } = useConnectionStatus();
    const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

    useEffect(() => {
      if (attemptFetchWhenOffline || isOnline) {
        setHasAttemptedFetch(true);
      }
    }, [isOnline, attemptFetchWhenOffline]);

    // If component is not critical, just render it with maybe a warning
    if (!criticalComponent || !isOffline) {
      return (
        <>
          {isOffline && (
            <div className="mb-3">
              <OfflineIndicator variant="banner" />
            </div>
          )}
          <WrappedComponent {...props} isOffline={isOffline} isOnline={isOnline} />
        </>
      );
    }

    // For critical components when offline, show the fallback
    if (isOffline && criticalComponent) {
      if (fallbackComponent) {
        const FallbackComponent = fallbackComponent;
        return <FallbackComponent {...props} />;
      }

      return (
        <FormErrorFallback
          error={null}
          title="Offline Mode"
          message={offlineMessage}
          componentName="OfflineFallback"
          action={
            <div className="mt-2">
              <OfflineIndicator />
            </div>
          }
        />
      );
    }

    return <WrappedComponent {...props} isOffline={isOffline} isOnline={isOnline} />;
  };

  ComponentWithOfflineFallback.displayName = `WithOfflineFallback(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return ComponentWithOfflineFallback;
}

export default withOfflineFallback;
