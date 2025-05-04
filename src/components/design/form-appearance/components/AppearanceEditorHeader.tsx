
import React from "react";
import { CardTitle } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface AppearanceEditorHeaderProps {
  onReload: () => void;
}

const AppearanceEditorHeader: React.FC<AppearanceEditorHeaderProps> = ({ onReload }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CardTitle className="text-lg">Form Appearance</CardTitle>
        <InfoTooltip contentKey="form-appearance" size={16} />
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onReload}
        className="flex items-center gap-1"
      >
        <RefreshCcw className="h-3.5 w-3.5" />
        <span>Reload</span>
      </Button>
    </div>
  );
};

export default AppearanceEditorHeader;
