
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface EmptyStateAlertProps {
  message: string;
}

const EmptyStateAlert: React.FC<EmptyStateAlertProps> = ({ message }) => {
  return (
    <Alert className="bg-amber-50 border-amber-200">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default EmptyStateAlert;
