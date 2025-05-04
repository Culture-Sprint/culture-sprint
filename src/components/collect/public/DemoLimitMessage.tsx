
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DemoLimitMessageProps {
  demoLimitReached: boolean;
}

const DemoLimitMessage: React.FC<DemoLimitMessageProps> = ({
  demoLimitReached
}) => {
  if (!demoLimitReached) {
    return null;
  }
  
  return (
    <>
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Demo Limit Reached</AlertTitle>
        <AlertDescription>
          This project has reached the maximum of 15 stories for demo accounts. 
          Please contact the project owner to upgrade their account for unlimited stories.
        </AlertDescription>
      </Alert>
      
      <div className="text-center p-8 border rounded-lg bg-muted">
        <h3 className="text-xl font-semibold mb-2">Demo Account Limit Reached</h3>
        <p>This project has reached the maximum of 15 stories.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Demo accounts are limited to 15 stories per project.
          Please contact the owner to upgrade their account for unlimited access.
        </p>
      </div>
    </>
  );
};

export default DemoLimitMessage;
