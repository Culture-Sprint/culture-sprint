
import React from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface FormErrorFallbackProps {
  error?: Error;
  title?: string;
  message?: string;
  resetError?: () => void;
  componentName?: string;
  action?: React.ReactNode;
}

/**
 * Error fallback component designed for form or component-level errors
 */
export const FormErrorFallback: React.FC<FormErrorFallbackProps> = ({
  error,
  title = "Something went wrong",
  message,
  resetError,
  componentName,
  action
}) => {
  const displayMessage = message || (error ? error.message : "An unexpected error occurred");
  
  const handleReset = () => {
    if (resetError) {
      resetError();
    }
  };
  
  return (
    <Alert variant="destructive" className="my-4 animate-in fade-in duration-300">
      <div className="flex gap-2 items-start">
        <AlertTriangle className="h-5 w-5 mt-0.5" />
        <div>
          <AlertTitle className="mb-1">{title}</AlertTitle>
          <AlertDescription className="text-sm">
            {displayMessage}
            
            {componentName && process.env.NODE_ENV !== 'production' && (
              <div className="mt-1 text-xs opacity-80">
                Error in component: {componentName}
              </div>
            )}
          </AlertDescription>
          
          <div className="mt-3 flex gap-3 items-center">
            {action}
            
            {resetError && (
              <Button variant="outline" size="sm" onClick={handleReset}>
                Try again
              </Button>
            )}
          </div>
        </div>
      </div>
    </Alert>
  );
};
