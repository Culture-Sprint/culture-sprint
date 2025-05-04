
import React from "react";
import { Check, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Option } from "@/hooks/useParticipantQuestions";

interface OptionSelectorProps {
  options: Option[];
  otherOptions: Option[];
  newOption: string;
  showAddField: boolean;
  onToggleOption: (id: string) => void;
  onToggleOtherOption: (id: string) => void;
  onRemoveOption: (id: string) => void;
  onAddOption: () => void;
  onNewOptionChange: (value: string) => void;
  onShowAddFieldChange: (show: boolean) => void;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  options,
  otherOptions,
  newOption,
  showAddField,
  onToggleOption,
  onToggleOtherOption,
  onRemoveOption,
  onAddOption,
  onNewOptionChange,
  onShowAddFieldChange
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddOption();
    } else if (e.key === "Escape") {
      onShowAddFieldChange(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Choose what information you want to collect from participants who share stories.
      </p>
      
      {options.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={option.checked}
            onCheckedChange={() => onToggleOption(option.id)}
          />
          <Label htmlFor={option.id} className="cursor-pointer">
            {option.label}
          </Label>
        </div>
      ))}
      
      {otherOptions.map((option) => (
        <div key={option.id} className="flex items-center space-x-2">
          <Checkbox
            id={option.id}
            checked={option.checked}
            onCheckedChange={() => onToggleOtherOption(option.id)}
          />
          <Label htmlFor={option.id} className="cursor-pointer">
            {option.label}
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemoveOption(option.id)}
            className="h-6 w-6 p-0 ml-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      {showAddField ? (
        <div className="flex items-center space-x-2 mt-4">
          <Input
            placeholder="Enter new option"
            value={newOption}
            onChange={(e) => onNewOptionChange(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-8"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={onAddOption}
            className="h-8"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onShowAddFieldChange(false)}
            className="h-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onShowAddFieldChange(true)}
          className="mt-2 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Other Option
        </Button>
      )}
    </div>
  );
};

export default OptionSelector;
