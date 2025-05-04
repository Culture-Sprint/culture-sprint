
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BeakerIcon } from "lucide-react";

interface TestingAlertProps {
  useNewImplementation: boolean;
}

const TestingAlert: React.FC<TestingAlertProps> = ({
  useNewImplementation
}) => {
  return (
    <Alert className="mb-4 bg-amber-50 border-amber-300">
      <BeakerIcon className="h-4 w-4 text-amber-800" />
      <AlertTitle className="text-amber-800">Testing Mode Active</AlertTitle>
      <AlertDescription className="text-amber-700 text-sm">
        You can toggle between the legacy and unified form data loaders using the control panel in the top right.
        Currently using the <strong>{useNewImplementation ? 'unified (new)' : 'legacy'}</strong> implementation.
      </AlertDescription>
    </Alert>
  );
};

export default TestingAlert;
