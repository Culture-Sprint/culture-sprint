
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface BackgroundColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const BackgroundColorPicker: React.FC<BackgroundColorPickerProps> = ({ 
  value, 
  onChange,
  disabled = false 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.value);
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Label htmlFor="background-color" className="text-sm font-medium">Background Color</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[220px] text-xs">
                  Choose a background color for your form. Use hex color codes like #f9fafb.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center space-x-2">
          <div 
            className="h-5 w-5 rounded border border-gray-300" 
            style={{ backgroundColor: value }}
          />
          <Input 
            type="color" 
            value={value} 
            onChange={handleChange} 
            className="h-7 w-10 p-0 cursor-pointer"
            disabled={disabled}
          />
        </div>
      </div>
      
      <div className="flex gap-2">
        <Input 
          id="background-color"
          value={value} 
          onChange={handleChange} 
          placeholder="#f9fafb"
          className="text-sm"
          disabled={disabled}
        />
      </div>
      
      <p className="text-xs text-gray-500">
        The background color of your public form page
      </p>
    </div>
  );
};

export default BackgroundColorPicker;
