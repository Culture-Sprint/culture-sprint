
import { useState, useRef, useEffect } from 'react';
import { useAudioPlayback } from './voice-recording/useAudioPlayback';
import { usePermissions } from './voice-recording/usePermissions';
import { useRecorder } from './voice-recording/useRecorder';

export const useVoiceRecording = () => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioBlob = useRef<Blob | null>(null);
  const isMountedRef = useRef(true);
  
  const {
    isPlaying,
    error: playbackError,
    playAudio,
    stopPlayback,
    audioRef
  } = useAudioPlayback();

  const {
    permissionState,
    checkMicrophonePermission
  } = usePermissions();

  const {
    isRecording,
    recordingStatus,
    error: recordingError,
    startRecording: startRecorder,
    pauseRecording,
    resumeRecording,
    stopRecording: stopRecorder
  } = useRecorder();

  // Add mount/unmount effect for cleanup
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
      
      // Clean up audio URL on unmount
      if (audioUrl) {
        try {
          URL.revokeObjectURL(audioUrl);
          console.log("Revoked audio URL object on unmount");
        } catch (e) {
          console.error("Error revoking URL object:", e);
        }
      }
      
      // Make sure recording is stopped
      if (isRecording) {
        try {
          console.log("Stopping recording on unmount");
          stopRecorder().catch(err => console.error("Error stopping recorder on unmount:", err));
        } catch (e) {
          console.error("Error stopping recording on unmount:", e);
        }
      }
      
      // Stop any playback
      stopPlayback();
    };
  }, []);

  const startRecording = async () => {
    stopPlayback();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    await startRecorder(checkMicrophonePermission);
  };

  const stopRecording = async () => {
    try {
      const newAudioBlob = await stopRecorder();
      audioBlob.current = newAudioBlob;
      
      if (!isMountedRef.current) return;
      
      const url = URL.createObjectURL(newAudioBlob);
      setAudioUrl(url);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    } catch (err) {
      console.error('Error stopping recording:', err);
    }
  };

  const playRecording = () => {
    if (audioUrl && isMountedRef.current) {
      playAudio(audioUrl);
    }
  };

  return {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    playRecording,
    stopPlayback,
    audioUrl,
    audioBlob,
    isRecording,
    isPlaying,
    recordingStatus,
    permissionState,
    error: recordingError || playbackError
  };
};
