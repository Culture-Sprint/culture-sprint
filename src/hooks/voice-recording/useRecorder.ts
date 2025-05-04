
import { useState, useRef } from 'react';
import { toast } from '@/components/ui/use-toast';

export const useRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'paused'>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async (onPermissionGranted: () => Promise<boolean>) => {
    try {
      const canProceed = await onPermissionGranted();
      if (!canProceed) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let mimeType = 'audio/webm';
      const options: MediaRecorderOptions = {};
      
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }
      
      console.log(`Using MIME type: ${mimeType} for recording`);
      options.mimeType = mimeType;
      
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingStatus('recording');
      setError(null);
      
      toast({
        title: "Recording started",
        description: "Your microphone is now recording"
      });
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(err instanceof Error ? err.message : 'Could not start recording');
      toast({
        variant: "destructive",
        title: "Recording failed",
        description: "Could not start recording. Please try again"
      });
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.pause();
      setRecordingStatus('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'paused') {
      mediaRecorderRef.current.resume();
      setRecordingStatus('recording');
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    return new Promise<Blob>((resolve) => {
      mediaRecorderRef.current!.onstop = () => {
        try {
          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/webm';
          console.log(`Creating blob with MIME type: ${mimeType}`);
          
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          setIsRecording(false);
          setRecordingStatus('idle');
          
          toast({
            title: "Recording complete",
            description: "Your recording is ready for playback"
          });
          
          resolve(audioBlob);
        } catch (err) {
          console.error('Error processing recording:', err);
          toast({
            variant: "destructive",
            title: "Recording error",
            description: "Could not process recording"
          });
          throw err;
        }
      };

      mediaRecorderRef.current!.stop();
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    });
  };

  return {
    isRecording,
    recordingStatus,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording
  };
};
