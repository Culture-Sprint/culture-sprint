
import { useState, useCallback } from 'react';
import { useConnectionStatus } from '@/hooks/useConnectionStatus';
import { addToOfflineQueue } from '@/utils/network/offlineQueue';
import { useToast } from '@/hooks/toast';

interface OfflineFormOptions {
  operationType: string;
  offlineStorageKey?: string;
  priority?: number;
  showToasts?: boolean;
}

/**
 * Hook for handling form submissions with offline support
 */
export function useOfflineForm<T>({
  operationType,
  offlineStorageKey,
  priority = 1,
  showToasts = true
}: OfflineFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedData, setLastSavedData] = useState<T | null>(null);
  const { isOnline } = useConnectionStatus();
  const { toast } = useToast();

  // Load local data if available
  const loadLocalData = useCallback((): T | null => {
    if (!offlineStorageKey) return null;
    
    try {
      const storedData = localStorage.getItem(offlineStorageKey);
      if (!storedData) return null;
      
      return JSON.parse(storedData) as T;
    } catch (error) {
      console.error('Failed to load local form data:', error);
      return null;
    }
  }, [offlineStorageKey]);

  // Save data locally
  const saveLocalData = useCallback((data: T): void => {
    if (!offlineStorageKey) return;
    
    try {
      localStorage.setItem(offlineStorageKey, JSON.stringify(data));
      setLastSavedData(data);
    } catch (error) {
      console.error('Failed to save local form data:', error);
    }
  }, [offlineStorageKey]);

  // Submit handler with offline support
  const submitForm = useCallback(async (
    data: T,
    onlineSubmitFn: (data: T) => Promise<any>,
    options: { skipLocalSave?: boolean } = {}
  ): Promise<any> => {
    setIsSubmitting(true);
    
    try {
      // Always save locally for recovery, unless explicitly skipped
      if (!options.skipLocalSave && offlineStorageKey) {
        saveLocalData(data);
      }
      
      // If online, submit normally
      if (isOnline) {
        const result = await onlineSubmitFn(data);
        
        if (showToasts) {
          toast({
            title: "Success",
            description: "Your data has been submitted successfully.",
            variant: "success"
          });
        }
        
        return result;
      } else {
        // If offline, queue for later submission
        addToOfflineQueue(operationType, data, { priority });
        
        if (showToasts) {
          toast({
            title: "Saved for later",
            description: "You're offline. Your data has been saved and will be submitted when you reconnect.",
            variant: "info"
          });
        }
        
        // Return a mock success result
        return { success: true, offlineQueued: true };
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      
      // Even if online submission fails, save locally as backup
      if (offlineStorageKey) {
        saveLocalData(data);
        addToOfflineQueue(operationType, data, { priority });
      }
      
      if (showToasts) {
        toast({
          title: "Error",
          description: "There was a problem submitting your data. It has been saved locally and will be retried later.",
          variant: "destructive"
        });
      }
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [isOnline, offlineStorageKey, operationType, priority, saveLocalData, showToasts, toast]);

  // Clear local data
  const clearLocalData = useCallback((): void => {
    if (!offlineStorageKey) return;
    
    try {
      localStorage.removeItem(offlineStorageKey);
      setLastSavedData(null);
    } catch (error) {
      console.error('Failed to clear local form data:', error);
    }
  }, [offlineStorageKey]);

  return {
    isSubmitting,
    submitForm,
    isOffline: !isOnline,
    isOnline,
    loadLocalData,
    saveLocalData,
    clearLocalData,
    lastSavedData
  };
}

export default useOfflineForm;
