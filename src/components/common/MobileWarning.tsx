
import React from "react";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface MobileWarningProps {
  className?: string;
}

const MobileWarning: React.FC<MobileWarningProps> = ({ className }) => {
  return (
    <div className={cn("p-4 flex items-center justify-center min-h-screen", className)}>
      <Alert variant="default" className="max-w-md border-amber-300 bg-amber-50">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <AlertTitle className="text-amber-800 text-lg font-semibold">
          Small Screen Detected
        </AlertTitle>
        <AlertDescription className="text-amber-700 mt-2">
          <p>
            This application is designed for larger screens and may not provide an optimal experience on mobile phones.
          </p>
          <p className="mt-3">
            For the best experience, please use a tablet, laptop or desktop computer to access the full functionality.
          </p>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MobileWarning;
