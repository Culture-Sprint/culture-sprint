
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export const usePermissions = () => {
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');

  const isMicrophoneSupported = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  const checkMicrophonePermission = async () => {
    if (!isMicrophoneSupported()) {
      setPermissionState('unsupported');
      toast({
        variant: "destructive",
        title: "Microphone not supported",
        description: "Your browser does not support microphone access"
      });
      return false;
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = devices.filter(device => device.kind === 'audioinput');
      
      if (audioInputs.length === 0) {
        setPermissionState('unsupported');
        toast({
          variant: "destructive",
          title: "No microphone detected",
          description: "Please connect a microphone and try again"
        });
        return false;
      }

      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      setPermissionState(permission.state as 'prompt' | 'granted' | 'denied');
      
      if (permission.state === 'denied') {
        toast({
          variant: "destructive",
          title: "Microphone access denied",
          description: "Please enable microphone access in your browser settings"
        });
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Error checking microphone permission:', err);
      return false;
    }
  };

  return {
    permissionState,
    setPermissionState,
    checkMicrophonePermission
  };
};
