
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Pause, Play, StopCircle } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  recordingStatus: 'idle' | 'recording' | 'paused';
  permissionState: 'prompt' | 'granted' | 'denied' | 'unsupported';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  recordingStatus,
  permissionState,
  onStart,
  onPause,
  onResume,
  onFinish
}) => {
  // Handle button clicks with preventDefault to avoid form submission
  const handleButtonClick = (handler: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    handler();
  };

  if (isRecording) {
    return (
      <div className="flex gap-2 w-full">
        {recordingStatus === 'recording' ? (
          <Button 
            onClick={handleButtonClick(onPause)}
            variant="outline"
            size="lg"
            className="flex-1"
            type="button"
          >
            <Pause className="mr-2 h-5 w-5" />
            Pause
          </Button>
        ) : (
          <Button 
            onClick={handleButtonClick(onResume)}
            variant="outline"
            size="lg"
            className="flex-1"
            type="button"
          >
            <Play className="mr-2 h-5 w-5" />
            Resume
          </Button>
        )}
        <Button 
          onClick={handleButtonClick(onFinish)}
          variant="default"
          size="lg"
          className="flex-1"
          type="button"
        >
          <StopCircle className="mr-2 h-5 w-5" />
          Finish
        </Button>
      </div>
    );
  }
  
  return (
    <Button 
      onClick={handleButtonClick(onStart)}
      variant="outline"
      size="lg"
      className="w-full"
      type="button"
      disabled={permissionState === 'denied' || permissionState === 'unsupported'}
    >
      <Mic className="mr-2 h-5 w-5" />
      Start Recording
    </Button>
  );
};
