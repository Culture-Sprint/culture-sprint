
import React from "react";
import { Switch } from "@/components/ui/switch";

interface LoaderControlsLoadingProps {
  useUnifiedLoader: boolean;
  toggleLoader: () => void;
  isSuperAdmin: boolean;
}

const LoaderControlsLoading: React.FC<LoaderControlsLoadingProps> = ({
  useUnifiedLoader,
  toggleLoader,
  isSuperAdmin
}) => {
  if (!isSuperAdmin) return null;
  
  return (
    <div className="mt-4 p-4 rounded-lg border border-amber-300 bg-amber-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch
            id="loader-toggle-loading"
            checked={useUnifiedLoader}
            onCheckedChange={toggleLoader}
          />
          <label htmlFor="loader-toggle-loading" className="cursor-pointer text-sm font-medium">
            Use Unified Form Loader (Testing)
          </label>
        </div>
        <div className="text-amber-700 text-xs font-medium px-2 py-1 bg-amber-100 rounded">
          {useUnifiedLoader ? "Unified Loader Active" : "Legacy Loader Active"}
        </div>
      </div>
    </div>
  );
};

export default LoaderControlsLoading;
