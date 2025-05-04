
import React, { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface LogoUploadButtonProps {
  onFileSelected: (file: File | null) => void;
  isUploading: boolean;
  hasLogo: boolean;
  isValidLogo: boolean;
}

const LogoUploadButton: React.FC<LogoUploadButtonProps> = ({
  onFileSelected,
  isUploading,
  hasLogo,
  isValidLogo
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelected(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const buttonText = isUploading 
    ? 'Uploading...' 
    : (hasLogo && isValidLogo ? 'Change Logo' : 'Upload Logo');
  
  return (
    <div>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <Button
        type="button"
        variant="outline"
        onClick={handleButtonClick}
        className="flex items-center gap-1"
        disabled={isUploading}
      >
        <Upload className="h-4 w-4 mr-1" />
        {buttonText}
      </Button>
    </div>
  );
};

export default LogoUploadButton;
