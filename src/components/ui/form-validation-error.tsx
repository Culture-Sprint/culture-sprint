
import React from 'react';
import { ErrorDisplay, ErrorDisplayProps } from "@/components/ui/error-display";

export interface FormValidationErrorProps extends Omit<ErrorDisplayProps, 'severity'> {
  errors?: Record<string, string> | null;
  showSummary?: boolean;
}

export const FormValidationError: React.FC<FormValidationErrorProps> = ({
  errors,
  message,
  showSummary = true,
  title = "Form Error",
  ...props
}) => {
  if (!errors && !message) return null;
  
  const errorCount = errors ? Object.keys(errors).length : 0;
  const hasErrors = errorCount > 0 || !!message;
  
  if (!hasErrors) return null;

  return (
    <ErrorDisplay
      severity="error"
      title={title}
      message={message || (showSummary ? `Please correct ${errorCount} error${errorCount === 1 ? '' : 's'} in the form.` : undefined)}
      {...props}
    >
      {errors && showSummary && errorCount > 0 && (
        <ul className="mt-2 list-disc list-inside text-sm">
          {Object.entries(errors).map(([field, message]) => (
            <li key={field}>{message}</li>
          ))}
        </ul>
      )}
    </ErrorDisplay>
  );
};
