
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export const useAudioPlayback = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // Flag to track if component is mounted
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      audioRef.current.onplay = () => {
        if (isMountedRef.current) {
          console.log("Audio started playing");
          setIsPlaying(true);
        }
      };
      
      audioRef.current.onended = () => {
        if (isMountedRef.current) {
          console.log("Audio playback ended");
          setIsPlaying(false);
        }
      };
      
      audioRef.current.onpause = () => {
        if (isMountedRef.current) {
          console.log("Audio playback paused");
          setIsPlaying(false);
        }
      };
      
      audioRef.current.onerror = (e) => {
        if (isMountedRef.current) {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
          setError("Error playing audio");
          
          // Only show toast if component is mounted
          toast({
            variant: "destructive",
            title: "Playback error",
            description: "Could not play the recording. Try downloading it instead."
          });
        }
      };
    }
    
    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;
      
      // Cleanup audio element
      if (audioRef.current) {
        try {
          // Save reference to avoid errors during cleanup
          const audio = audioRef.current;
          
          // Remove event listeners
          audio.onplay = null;
          audio.onended = null;
          audio.onpause = null;
          audio.onerror = null;
          
          // Pause and reset audio
          audio.pause();
          audio.src = '';
          audio.load();
        } catch (err) {
          console.error("Error cleaning up audio element:", err);
        }
      }
    };
  }, []);

  const playAudio = async (audioUrl: string) => {
    if (!audioUrl || !audioRef.current || !isMountedRef.current) {
      console.warn("No audio URL, audio element, or component unmounted");
      return;
    }
    
    try {
      console.log("Playing audio from URL:", audioUrl);
      
      if (isPlaying) {
        audioRef.current.pause();
        return;
      }
      
      const attemptPlay = async () => {
        try {
          if (!audioRef.current || !isMountedRef.current) return;
          
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          await audioRef.current.play();
          
          if (isMountedRef.current) {
            toast({
              title: "Playing recording",
              description: "Your recording is now playing"
            });
          }
        } catch (err1) {
          console.error("Error playing with direct URL:", err1);
          throw err1;
        }
      };
      
      await attemptPlay();
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Error in playAudio:", err);
        toast({
          variant: "destructive",
          title: "Browser compatibility issue",
          description: "Your browser doesn't support this audio format. Try downloading the recording instead."
        });
      }
    }
  };

  const stopPlayback = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    error,
    playAudio,
    stopPlayback,
    audioRef
  };
};
