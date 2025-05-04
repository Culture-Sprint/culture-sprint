
import React from "react";
import { Loader2 } from "lucide-react";

const LoadingState: React.FC = () => {
  return (
    <div className="h-[400px] w-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center animate-fade-in">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <p className="text-gray-600 animate-pulse">Analyzing story themes...</p>
        <p className="text-gray-400 text-sm mt-1">This may take up to 30 seconds</p>
      </div>
    </div>
  );
};

export default LoadingState;
