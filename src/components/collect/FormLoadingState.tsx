
import React from "react";
import { Loader2 } from "lucide-react";

const FormLoadingState: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-culturesprint-600 mb-4" />
      <div className="text-culturesprint-500 text-lg font-medium">Loading form...</div>
      <p className="text-culturesprint-400 text-sm mt-2">
        Please wait while we prepare your story collection form
      </p>
    </div>
  );
};

export default FormLoadingState;
