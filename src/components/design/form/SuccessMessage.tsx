
import React from "react";
import { Check } from "lucide-react";

interface SuccessMessageProps {
  onComplete?: () => void;
  message?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ message = "Response saved successfully!" }) => {
  return (
    <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
      <div className="flex items-center gap-2">
        <Check className="h-4 w-4" />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default SuccessMessage;
