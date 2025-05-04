
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, Save } from "lucide-react";

interface FormActionButtonsProps {
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
  isLoading: boolean;
  isUploading?: boolean;
  disabled?: boolean;
}

const FormActionButtons: React.FC<FormActionButtonsProps> = ({ 
  onSave, 
  onReset, 
  isSaving, 
  isLoading,
  isUploading = false,
  disabled = false
}) => {
  const isProcessing = isSaving || isUploading;
  
  return (
    <div className="flex justify-end gap-3 pt-4">
      <Button
        variant="outline"
        onClick={onReset}
        disabled={isLoading || isProcessing || disabled}
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Reset to Defaults
      </Button>
      
      <Button
        variant="default"
        onClick={onSave}
        disabled={isLoading || isProcessing || disabled}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {isUploading ? 'Uploading...' : 'Saving...'}
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
};

export default FormActionButtons;
