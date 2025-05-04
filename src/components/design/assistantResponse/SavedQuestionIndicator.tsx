
import React from "react";
import { CheckCircle } from "lucide-react";

interface SavedQuestionIndicatorProps {
  saved: boolean;
}

const SavedQuestionIndicator: React.FC<SavedQuestionIndicatorProps> = ({ saved }) => {
  if (!saved) {
    return null;
  }

  return (
    <div className="mt-4 bg-green-50 p-2 rounded-md border border-green-100 flex items-center justify-center gap-2 text-green-700">
      <CheckCircle className="h-4 w-4" />
      <span className="text-sm font-medium">Question Saved</span>
    </div>
  );
};

export default SavedQuestionIndicator;
