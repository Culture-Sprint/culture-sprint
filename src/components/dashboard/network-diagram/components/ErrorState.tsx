
import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ErrorStateProps {
  error: Error;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  // Check if this is an edge function error
  const isEdgeFunctionError = error.message.includes("Edge function");
  
  return (
    <div className="h-[400px] w-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center max-w-md animate-fade-in p-6 bg-white/80 rounded-lg shadow-sm border border-red-100">
        <AlertCircle className={`w-8 h-8 mb-3 ${isEdgeFunctionError ? "text-amber-500" : "text-destructive"}`} />
        <h3 className="font-semibold mb-2 text-lg">
          {isEdgeFunctionError ? "Theme Analysis Needs Refresh" : "Theme Analysis Failed"}
        </h3>
        <p className="text-gray-600 mb-3">
          {isEdgeFunctionError ? "Press the Refresh Themes button." : error.message}
        </p>
        {!isEdgeFunctionError && <p className="text-gray-400 text-sm">Please try again</p>}
      </div>
    </div>
  );
};

export default ErrorState;
