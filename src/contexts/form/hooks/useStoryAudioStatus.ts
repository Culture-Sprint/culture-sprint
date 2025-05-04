
// Handles audio status and refs for the form

import { useEffect, useRef, useState } from "react";

export function useStoryAudioStatus() {
  const [hasAudioRecording, setHasAudioRecording] = useState(false);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const handleAudioComplete = (event: any) => {
      setHasAudioRecording(true);
      if (event.detail.audioUrl) {
        audioUrlRef.current = event.detail.audioUrl;
      }
    };

    window.addEventListener("audio-recording-completed", handleAudioComplete);
    return () => {
      window.removeEventListener("audio-recording-completed", handleAudioComplete);
    };
  }, []);

  return { hasAudioRecording, audioUrlRef };
}
