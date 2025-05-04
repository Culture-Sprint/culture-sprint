
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SaveChangesButtonProps {
  editedThemesCount: number;
  onSaveAll: () => void;
  allChangesSaved?: boolean;
}

const SaveChangesButton: React.FC<SaveChangesButtonProps> = ({ 
  editedThemesCount, 
  onSaveAll, 
  allChangesSaved = false 
}) => {
  // Update saved state in localStorage whenever it changes
  useEffect(() => {
    if (allChangesSaved) {
      localStorage.setItem('sliderThemesSaved', 'true');
    } else if (editedThemesCount > 0) {
      localStorage.setItem('sliderThemesSaved', 'false');
    }
  }, [allChangesSaved, editedThemesCount]);

  return (
    <div className="mt-6 flex justify-end">
      <Button 
        onClick={onSaveAll} 
        className="flex gap-2 items-center bg-brand-primary hover:bg-brand-tertiary"
        disabled={editedThemesCount === 0 && allChangesSaved}
      >
        <Save size={18} />
        {editedThemesCount > 0 
          ? `Save All Changes (${editedThemesCount})` 
          : allChangesSaved 
            ? "All Changes Saved" 
            : "Save Questions"}
      </Button>
    </div>
  );
};

export default SaveChangesButton;
