
import React from "react";
import { Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ThemeHeaderProps {
  theme: string;
  isEditing: boolean;
  editedTheme: string;
  setEditedTheme: (theme: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ThemeHeader: React.FC<ThemeHeaderProps> = ({
  theme,
  isEditing,
  editedTheme,
  setEditedTheme,
  onEdit,
  onSave,
  onCancel
}) => {
  return (
    <div className="flex justify-between items-center">
      {isEditing ? (
        <Input 
          value={editedTheme} 
          onChange={(e) => setEditedTheme(e.target.value)}
          className="font-medium"
        />
      ) : (
        <Badge variant="outline" className="bg-brand-accent text-brand-primary font-medium px-3 py-1.5 text-sm">
          {theme}
        </Badge>
      )}
      
      {isEditing ? (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onSave}
            className="flex items-center gap-1"
          >
            <Save size={16} />
            Save
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onCancel}
            className="flex items-center gap-1"
          >
            <X size={16} />
            Cancel
          </Button>
        </div>
      ) : (
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onEdit}
          className="flex items-center gap-1 text-brand-primary hover:text-brand-tertiary"
        >
          <Pencil size={16} />
          Edit
        </Button>
      )}
    </div>
  );
};

export default ThemeHeader;
