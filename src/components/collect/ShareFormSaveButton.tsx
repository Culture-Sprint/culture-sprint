
import React from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareFormSaveButtonProps {
  isSaving: boolean;
  onClick: () => void;
}

const ShareFormSaveButton: React.FC<ShareFormSaveButtonProps> = ({ 
  isSaving, 
  onClick 
}) => {
  return (
    <Button 
      onClick={onClick} 
      disabled={isSaving}
      className="flex items-center gap-2 w-full sm:w-auto"
    >
      {isSaving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          Save Form Configuration
        </>
      )}
    </Button>
  );
};

export default ShareFormSaveButton;
