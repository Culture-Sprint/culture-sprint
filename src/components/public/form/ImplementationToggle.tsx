
import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InfoIcon } from "lucide-react";

interface ImplementationToggleProps {
  useNewImplementation: boolean;
  toggleImplementation: () => void;
  toggleDebugDialog: () => void;
}

const ImplementationToggle: React.FC<ImplementationToggleProps> = ({
  useNewImplementation,
  toggleImplementation,
  toggleDebugDialog
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 bg-white p-3 rounded-lg shadow-md border border-amber-300">
      <div className="flex items-center gap-2">
        <Switch 
          id="implementation-toggle" 
          checked={useNewImplementation} 
          onCheckedChange={toggleImplementation} 
        />
        <Label htmlFor="implementation-toggle" className="cursor-pointer text-sm font-medium">
          Use {useNewImplementation ? 'New' : 'Legacy'} Implementation
        </Label>
        <div className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
          useNewImplementation ? 'bg-green-100 text-green-800 border border-green-300' : 
          'bg-blue-100 text-blue-800 border border-blue-300'
        }`}>
          {useNewImplementation ? 'Unified' : 'Legacy'}
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
        <button 
          onClick={toggleDebugDialog}
          className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-1 px-3 rounded-md shadow-sm flex items-center"
        >
          <InfoIcon className="h-3 w-3 mr-1" />
          Debug Info
        </button>
        <span className="text-xs text-gray-500">Form Loader Testing</span>
      </div>
    </div>
  );
};

export default ImplementationToggle;
