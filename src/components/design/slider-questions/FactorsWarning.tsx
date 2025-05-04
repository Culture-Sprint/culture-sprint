
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface FactorsWarningProps {
  show: boolean;
  onRefresh?: () => void;
}

const FactorsWarning: React.FC<FactorsWarningProps> = ({ show, onRefresh }) => {
  if (!show) return null;
  
  return (
    <Alert variant="default" className="bg-amber-50 border-amber-200 mb-4">
      <div className="flex items-start">
        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
        <div className="flex-1">
          <AlertTitle className="text-amber-800">Missing factors</AlertTitle>
          <AlertDescription className="text-amber-700">
            No influencing factors were found in your project. 
            We've generated generic questions instead. For better results, add 
            factors in the Define phase (under Discover → Factors) and then try again.
          </AlertDescription>
          {onRefresh && (
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 border-amber-300"
              >
                Retry Factor Detection
              </Button>
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default FactorsWarning;
