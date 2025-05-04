
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

interface SaveQuestionButtonProps {
  saved: boolean;
  loading: boolean;
  onSave: () => void;
}

const SaveQuestionButton: React.FC<SaveQuestionButtonProps> = ({ 
  saved, 
  loading, 
  onSave 
}) => {
  if (saved) {
    return null;
  }

  return (
    <div className="mt-4">
      <Button 
        onClick={onSave}
        className="w-full flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving Question...
          </>
        ) : (
          <>
            <Check className="h-4 w-4" />
            Choose This Question
          </>
        )}
      </Button>
    </div>
  );
};

export default SaveQuestionButton;
