
import React from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface LogoDisplayProps {
  logoUrl: string;
  isValidLogoUrl: boolean;
  isBlobUrl: boolean;
  onRemove: () => void;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({
  logoUrl,
  isValidLogoUrl,
  isBlobUrl,
  onRemove
}) => {
  if (!logoUrl || !isValidLogoUrl) return null;
  
  return (
    <div className="relative inline-block">
      <img 
        src={logoUrl} 
        alt="Logo preview" 
        className="max-h-[80px] max-w-[200px] border border-gray-200 rounded p-2 bg-white"
        onError={(e) => {
          console.error("Error loading logo:", logoUrl);
          // Hide the broken image
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
      
      {isBlobUrl && (
        <div className="absolute -bottom-1 -right-1">
          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded border border-amber-200">
            Temporary
          </span>
        </div>
      )}
    </div>
  );
};

export default LogoDisplay;
