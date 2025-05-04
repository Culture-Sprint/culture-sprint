
import React from "react";
import { ErrorDisplay } from "@/components/ui/error-display";
import { EnvValidationError } from "@/types/errors";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface EnvErrorDisplayProps {
  error: EnvValidationError;
  title?: string;
}

/**
 * Component for displaying environment variable configuration errors
 */
export function EnvErrorDisplay({ error, title = "Environment Configuration Error" }: EnvErrorDisplayProps) {
  // Skip if no missing variables
  if (!error.missingVars || error.missingVars.length === 0) {
    return null;
  }

  const openEnvExample = () => {
    // This is just to open the file in the editor - for development purposes
    console.info("Check .env.example file for required variables");
  };

  return (
    <ErrorDisplay
      severity="error"
      title={title}
      message={error.message}
      children={
        <React.Fragment>
          <p className="mb-2">
            The application is missing required environment variables:
          </p>
          <ul className="list-disc list-inside ml-2 mb-3 space-y-1">
            {error.missingVars.map((varName) => (
              <li key={varName} className="font-mono text-sm">
                {varName}
              </li>
            ))}
          </ul>
          <p className="text-sm">
            Please check your environment configuration and ensure all required variables are set.
          </p>
        </React.Fragment>
      }
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={openEnvExample}
          className="flex items-center gap-1.5"
        >
          <FileText className="h-4 w-4" />
          View Required Variables
        </Button>
      }
    />
  );
}
