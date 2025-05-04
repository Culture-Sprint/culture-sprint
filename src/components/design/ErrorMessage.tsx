
import React from "react";
import { ApiKeyError } from "@/components/ui/api-key-error";
import { ErrorDisplay } from "@/components/ui/error-display";
import { ErrorSeverity } from "@/utils/errorHandling";

interface ErrorMessageProps {
  error: string | null;
  errorCode: string | null;
  severity?: ErrorSeverity;
  title?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  errorCode, 
  severity = 'error',
  title
}) => {
  if (!error) {
    return null;
  }

  return (
    <>
      <ErrorDisplay 
        message={error}
        code={errorCode}
        severity={severity}
        title={title}
        className="mt-4"
      />
      
      <ApiKeyError errorCode={errorCode} />
    </>
  );
};

export default ErrorMessage;
