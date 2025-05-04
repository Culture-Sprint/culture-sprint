
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PermissionGuidanceProps {
  permissionState: 'prompt' | 'granted' | 'denied' | 'unsupported';
}

export const PermissionGuidance: React.FC<PermissionGuidanceProps> = ({
  permissionState
}) => {
  if (permissionState === 'denied') {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Microphone Access Denied</AlertTitle>
        <AlertDescription>
          <p>You need to allow microphone access to record your story.</p>
          <ol className="mt-2 ml-5 list-decimal text-sm">
            <li>Click the camera/microphone icon in your browser's address bar</li>
            <li>Select "Allow" for microphone access</li>
            <li>Refresh the page and try again</li>
          </ol>
        </AlertDescription>
      </Alert>
    );
  }
  
  if (permissionState === 'unsupported') {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Microphone Not Available</AlertTitle>
        <AlertDescription>
          Your device or browser doesn't support microphone access, or no microphone was detected. 
          Please try using a different device or browser.
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};
