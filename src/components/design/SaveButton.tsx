
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

interface SaveButtonProps {
  saving: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ saving }) => {
  return (
    <div className="flex justify-end">
      <Button 
        type="submit" 
        disabled={saving} 
        className="flex items-center gap-2 bg-brand-secondary hover:bg-brand-secondary/90 text-white font-medium px-4 py-2"
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save Response
      </Button>
    </div>
  );
};

export default SaveButton;
