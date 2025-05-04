
import React, { useEffect, useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { processQuestion } from "../story-question/questionUtils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle } from "lucide-react";
import { RecordingControls } from "./voice/RecordingControls";
import { PermissionGuidance } from "./voice/PermissionGuidance";
import { RecordingStatus } from "./voice/RecordingStatus";
import { AudioPlayback } from "./voice/AudioPlayback";

interface StoryInputMethodProps {
  storyQuestion: string | null;
  storyText: string;
  onChange: (value: string) => void;
  isPublic?: boolean;
}

const StoryInputMethod: React.FC<StoryInputMethodProps> = ({
  storyQuestion,
  storyText,
  onChange,
  isPublic = false
}) => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [hasAudioRecording, setHasAudioRecording] = useState<boolean>(false);
  const isMountedRef = useRef(true);
  
  const {
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    playRecording,
    audioUrl,
    isRecording,
    isPlaying,
    recordingStatus,
    error,
    permissionState
  } = useVoiceRecording();

  const questionText = processQuestion(storyQuestion || "");
  const placeholderText = "Tell us your story...";
  
  const handleRecordingComplete = async () => {
    try {
      console.log("Completing recording...");
      await stopRecording();
      
      if (!isMountedRef.current) return;
      
      console.log("Recording completed, audioUrl:", audioUrl);
      setHasAudioRecording(true);
      
      // Notify the form that we have audio by dispatching a custom event
      window.dispatchEvent(new CustomEvent('audio-recording-completed', { 
        detail: { hasAudio: true, audioUrl } 
      }));
    } catch (err) {
      console.error("Error completing recording:", err);
    }
  };

  const handlePlayRecording = () => {
    if (!isMountedRef.current) return;
    
    console.log("Handle play recording called, audioUrl:", audioUrl);
    playRecording();
  };

  const handleNewRecording = async () => {
    if (!isMountedRef.current) return;
    
    console.log("Starting new recording...");
    await startRecording();
  };

  // Add a debug effect to track audioUrl changes
  useEffect(() => {
    if (!isMountedRef.current) return;
    
    console.log("Audio URL changed:", audioUrl);
    
    // If audio URL exists, automatically switch to the voice tab and dispatch event
    if (audioUrl) {
      if (activeTab === "text") {
        setActiveTab("voice");
      }
      
      setHasAudioRecording(true);
      
      // Notify the form that we have audio by dispatching a custom event
      window.dispatchEvent(new CustomEvent('audio-recording-completed', { 
        detail: { hasAudio: true, audioUrl } 
      }));
    }
  }, [audioUrl, activeTab]);

  // Notify about audio status on mount and unmount
  useEffect(() => {
    isMountedRef.current = true;
    
    if (audioUrl) {
      console.log("Component mounted with existing audioUrl, dispatching event");
      setHasAudioRecording(true);
      window.dispatchEvent(new CustomEvent('audio-recording-completed', { 
        detail: { hasAudio: true, audioUrl } 
      }));
    }
    
    return () => {
      console.log("Component unmounting, audio status:", hasAudioRecording);
      isMountedRef.current = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label htmlFor="storyInput" className="flex items-start gap-1">
          <span className={`${isPublic ? 'text-blue-600' : 'text-culturesprint-600'}`}>
            {questionText || "Your story"} *
          </span>
        </Label>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Write Story</TabsTrigger>
          <TabsTrigger value="voice">Record Story</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <Textarea
            id="storyText"
            value={storyText}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholderText}
            className="min-h-[200px]"
          />
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <PermissionGuidance permissionState={permissionState} />

          {!audioUrl && !error && permissionState !== 'denied' && permissionState !== 'unsupported' && (
            <Alert variant="default" className="mb-4 bg-muted/50">
              <Info className="h-4 w-4" />
              <AlertTitle>Recording Instructions</AlertTitle>
              <AlertDescription className="text-sm">
                Click "Start Recording" and speak clearly into your microphone. 
                When finished, click "Finish" to complete your recording.
              </AlertDescription>
            </Alert>
          )}

          {error && permissionState !== 'denied' && permissionState !== 'unsupported' && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Recording Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/20">
            {!audioUrl ? (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  <RecordingControls
                    isRecording={isRecording}
                    recordingStatus={recordingStatus}
                    permissionState={permissionState}
                    onStart={startRecording}
                    onPause={pauseRecording}
                    onResume={resumeRecording}
                    onFinish={handleRecordingComplete}
                  />
                </div>
                <RecordingStatus
                  recordingStatus={recordingStatus}
                  isRecording={isRecording}
                />
              </div>
            ) : (
              <AudioPlayback
                audioUrl={audioUrl}
                onPlay={handlePlayRecording}
                onNewRecording={handleNewRecording}
                isPlaying={isPlaying}
              />
            )}
          </div>
          
          {audioUrl && (
            <div className="mt-2 text-sm text-green-600">
              <span className="font-medium">Audio recording ready for submission</span>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoryInputMethod;
