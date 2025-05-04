
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ErrorCategory } from "@/utils/errorLogging";

interface RecoverySuggestionProps {
  errorType: ErrorCategory | string;
  onTryAction?: () => void;
  customSuggestions?: string[];
  className?: string;
}

export const RecoverySuggestion: React.FC<RecoverySuggestionProps> = ({
  errorType,
  onTryAction,
  customSuggestions,
  className
}) => {
  // Generate suggestions based on the error type
  const getSuggestionsForErrorType = (): string[] => {
    if (customSuggestions && customSuggestions.length > 0) {
      return customSuggestions;
    }
    
    switch(errorType) {
      case 'network':
        return [
          "Check your internet connection",
          "The server might be temporarily unavailable",
          "Try refreshing the page"
        ];
      
      case 'auth':
        return [
          "Your session might have expired",
          "Try logging out and logging back in",
          "Check if you have the necessary permissions"
        ];
        
      case 'data':
        return [
          "The data might be temporarily unavailable",
          "Try refreshing the data",
          "The database might be undergoing maintenance"
        ];
        
      case 'ui':
        return [
          "Try refreshing the page",
          "Try using a different browser",
          "Clear your browser cache and cookies"
        ];
        
      case 'visualization':
        return [
          "Try adjusting the visualization settings",
          "Use a different visualization type",
          "Reduce the amount of data being visualized"
        ];
        
      case 'input':
        return [
          "Check if all required fields are filled correctly",
          "Ensure your input meets the validation requirements",
          "Try using a different input format"
        ];
        
      case 'storage':
        return [
          "You might be running low on storage space",
          "Clear your browser cache",
          "Try removing unused data from the application"
        ];
        
      case 'performance':
        return [
          "Try reducing the amount of data being processed",
          "Close other applications or browser tabs",
          "The server might be experiencing high load"
        ];
        
      default:
        return [
          "Try refreshing the page",
          "Log out and log back in",
          "Contact support if the issue persists"
        ];
    }
  };
  
  const suggestions = getSuggestionsForErrorType();
  
  return (
    <Alert className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Recovery Suggestions</AlertTitle>
      <AlertDescription>
        <div className="mt-2">
          <ul className="list-disc pl-5 space-y-1">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm">{suggestion}</li>
            ))}
          </ul>
          {onTryAction && (
            <div className="mt-3">
              <Button size="sm" onClick={onTryAction}>
                Try Recommended Action
              </Button>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default RecoverySuggestion;
