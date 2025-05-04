
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderTextEditorProps {
  headerText: string;
  subheaderText: string;
  onHeaderChange: (text: string) => void;
  onSubheaderChange: (text: string) => void;
  disabled?: boolean;
}

const HeaderTextEditor: React.FC<HeaderTextEditorProps> = ({ 
  headerText, 
  subheaderText, 
  onHeaderChange, 
  onSubheaderChange,
  disabled = false
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="header-text" className="text-sm font-medium">Header Text</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[220px] text-xs">
                  The main headline that appears at the top of your public form
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Input 
          id="header-text"
          value={headerText} 
          onChange={(e) => !disabled && onHeaderChange(e.target.value)} 
          placeholder="Share Your Story"
          className="text-sm"
          disabled={disabled}
        />
        
        <p className="text-xs text-gray-500">
          The main headline for your form
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Label htmlFor="subheader-text" className="text-sm font-medium">Subheader Text</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[220px] text-xs">
                  A brief description or instruction that appears below the header
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Input 
          id="subheader-text"
          value={subheaderText} 
          onChange={(e) => !disabled && onSubheaderChange(e.target.value)} 
          placeholder="Help us understand your experience by sharing your story below." 
          className="text-sm"
          disabled={disabled}
        />
        
        <p className="text-xs text-gray-500">
          A brief description that appears below the header
        </p>
      </div>
    </div>
  );
};

export default HeaderTextEditor;
