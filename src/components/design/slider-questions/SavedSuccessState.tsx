
import React from "react";
import { CheckCircle } from "lucide-react";

interface SavedSuccessStateProps {
  isVisible: boolean;
}

const SavedSuccessState: React.FC<SavedSuccessStateProps> = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="bg-green-100 p-3 rounded-md border border-green-200 mt-4 flex items-center gap-2">
      <CheckCircle size={18} className="text-green-600" />
      <p className="text-sm text-green-700">
        All changes have been saved successfully.
      </p>
    </div>
  );
};

export default SavedSuccessState;
