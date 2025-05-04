
import React from "react";

interface RecordingStatusProps {
  recordingStatus: 'idle' | 'recording' | 'paused';
  isRecording: boolean;
}

export const RecordingStatus: React.FC<RecordingStatusProps> = ({
  recordingStatus,
  isRecording
}) => {
  if (!isRecording) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
      {recordingStatus === 'recording' ? 'Recording in progress...' : 'Recording paused'}
    </div>
  );
};
