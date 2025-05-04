
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, Play, Pause, Download } from "lucide-react";
import { handleError } from "@/utils/errorHandling";

interface AudioPlaybackProps {
  audioUrl: string | null;
  onPlay: () => void;
  onNewRecording: () => void;
  isPlaying?: boolean;
}

export const AudioPlayback: React.FC<AudioPlaybackProps> = ({
  audioUrl,
  onPlay,
  onNewRecording,
  isPlaying = false
}) => {
  if (!audioUrl) return null;

  // Function to handle play button click without triggering form submission
  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("Play button clicked, calling onPlay handler");
    onPlay();
  };

  // Function to handle new recording button click without triggering form submission
  const handleNewRecording = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("New recording button clicked, calling onNewRecording handler");
    onNewRecording();
  };

  // Function to download the recording
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      if (!audioUrl) return;
      
      // Create an anchor element and trigger download
      const a = document.createElement("a");
      a.href = audioUrl;
      a.download = "recording.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      handleError(error, "Failed to download recording");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        <Button 
          onClick={handlePlay}
          variant="outline"
          size="lg"
          className="flex-1"
          type="button" // Explicitly set type to button to avoid form submission
        >
          {isPlaying ? (
            <Pause className="mr-2 h-5 w-5" />
          ) : (
            <Play className="mr-2 h-5 w-5" />
          )}
          {isPlaying ? "Pause Recording" : "Play Recording"}
        </Button>
        <Button 
          onClick={handleNewRecording}
          variant="default"
          size="lg"
          className="flex-1"
          type="button" // Explicitly set type to button to avoid form submission
        >
          <Mic className="mr-2 h-5 w-5" />
          Record New
        </Button>
      </div>
      
      <div className="text-center">
        <Button
          onClick={handleDownload}
          variant="ghost"
          size="sm"
          type="button"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <Download className="mr-1 h-3 w-3" />
          Download Recording
        </Button>
      </div>
    </div>
  );
};
