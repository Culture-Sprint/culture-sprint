
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface DebugControlsProps {
  toggleDebug: () => void;
  handleRefresh: () => void;
  showDebug: boolean;
  isSuperAdmin: boolean;
}

const DebugControls: React.FC<DebugControlsProps> = ({
  toggleDebug,
  handleRefresh,
  showDebug,
  isSuperAdmin
}) => {
  // Fixed the condition - previously had !process.env.NODE_ENV !== 'production'
  // which was comparing boolean with string
  if (process.env.NODE_ENV === 'production' && !isSuperAdmin) {
    return null;
  }
  
  return (
    <div className="mb-4 flex justify-between items-center">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={toggleDebug}
        className="text-xs bg-yellow-50 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
      >
        {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleRefresh}
        className="text-xs"
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Refresh Form Data
      </Button>
    </div>
  );
};

export default DebugControls;
