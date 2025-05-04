
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { HelpCircle, Upload, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LogoUploaderProps {
  logoUrl: string;
  onLogoChange: (url: string, file?: File) => void;
  projectId?: string;
  disabled?: boolean;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ 
  logoUrl, 
  onLogoChange, 
  projectId,
  disabled = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB. Please choose a smaller image.");
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert("Only image files are allowed.");
      return;
    }
    
    // Create a temporary URL for preview
    const objectUrl = URL.createObjectURL(file);
    onLogoChange(objectUrl, file);
  };

  const handleClearLogo = () => {
    if (disabled) return;
    onLogoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Label htmlFor="logo-upload" className="text-sm font-medium">Logo</Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="w-[220px] text-xs">
                Upload a logo to display at the top of your form. Recommended size is 200x120px.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        id="logo-upload"
        accept="image/*"
        onChange={handleFileSelection}
        className="hidden"
        disabled={disabled}
      />
      
      {logoUrl ? (
        <div className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col items-center relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-gray-900"
            onClick={handleClearLogo}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
          <img 
            src={logoUrl} 
            alt="Form logo" 
            className="max-w-[200px] max-h-[120px] object-contain" 
            onError={(e) => {
              console.error("Error loading logo:", logoUrl);
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full h-24 border-dashed flex flex-col gap-1 hover:bg-gray-50"
          onClick={handleUploadClick}
          disabled={disabled}
        >
          <Upload className="h-4 w-4" />
          <span className="text-xs">Upload Logo</span>
        </Button>
      )}
      
      <p className="text-xs text-gray-500">
        Add your organization's logo to personalize your form
      </p>
    </div>
  );
};

export default LogoUploader;
