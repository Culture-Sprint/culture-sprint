
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DemoLimitAlertProps {
  remainingStories: number | null;
  showDemoWarning: boolean;
  showDemoError: boolean;
  demoLimitReached: boolean;
}

const DemoLimitAlert: React.FC<DemoLimitAlertProps> = ({
  remainingStories,
  showDemoWarning,
  showDemoError,
  demoLimitReached,
}) => {
  if (!showDemoWarning && !demoLimitReached) return null;

  if (demoLimitReached || showDemoError) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demo Limit Reached</AlertTitle>
        <AlertDescription>
          You've reached the maximum of 15 stories for demo accounts. Please contact us to upgrade your account.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="default" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Demo Account Notice</AlertTitle>
      <AlertDescription>
        As a demo user, you can add {remainingStories} more {remainingStories === 1 ? "story" : "stories"} to this project (limit: 15).
      </AlertDescription>
    </Alert>
  );
};

export default DemoLimitAlert;
