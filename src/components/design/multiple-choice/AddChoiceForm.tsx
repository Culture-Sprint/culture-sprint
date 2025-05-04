
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AddChoiceFormProps {
  newChoice: string;
  onNewChoiceChange: (value: string) => void;
  onAddChoice: () => void;
}

const AddChoiceForm: React.FC<AddChoiceFormProps> = ({
  newChoice,
  onNewChoiceChange,
  onAddChoice,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="Add a new choice..."
        value={newChoice}
        onChange={(e) => onNewChoiceChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onAddChoice();
          }
        }}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={onAddChoice}
        className="whitespace-nowrap"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add
      </Button>
    </div>
  );
};

export default AddChoiceForm;
