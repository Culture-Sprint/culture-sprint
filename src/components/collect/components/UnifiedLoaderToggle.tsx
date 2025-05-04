
import React from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface UnifiedLoaderToggleProps {
  useUnifiedLoader: boolean;
  toggleLoader: () => void;
}

const UnifiedLoaderToggle: React.FC<UnifiedLoaderToggleProps> = ({ 
  useUnifiedLoader, 
  toggleLoader 
}) => {
  return (
    <div className="p-4 mb-2 rounded-lg border-2 border-amber-300 bg-amber-50 shadow-sm">
      <h3 className="font-bold text-amber-800 mb-2">Form Loader Testing Controls</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            id="loader-toggle"
            checked={useUnifiedLoader}
            onCheckedChange={toggleLoader}
          />
          <label htmlFor="loader-toggle" className="cursor-pointer text-sm font-medium">
            Use Unified Form Loader (Testing)
          </label>
        </div>
        <div className="text-amber-700 text-xs font-medium px-3 py-1.5 bg-amber-100 rounded-md border border-amber-200">
          {useUnifiedLoader ? "Unified Loader Active" : "Legacy Loader Active"}
        </div>
      </div>
      <p className="text-xs text-amber-700 mt-2">
        Toggle between the legacy and unified form data loading implementations to test and compare behavior.
      </p>
    </div>
  );
};

export default UnifiedLoaderToggle;
