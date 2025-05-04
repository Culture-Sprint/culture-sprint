
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Pencil, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { QuestionChoice } from "./types";

interface ChoiceListProps {
  choices: QuestionChoice[];
  onRemoveChoice: (choiceId: string) => void;
  onEditChoice: (choiceId: string, newLabel: string) => void;
}

const ChoiceList: React.FC<ChoiceListProps> = ({ 
  choices, 
  onRemoveChoice,
  onEditChoice 
}) => {
  const [editingChoiceId, setEditingChoiceId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (choices.length === 0) {
    return <p className="text-sm text-gray-500 italic">No choices added yet</p>;
  }

  const handleStartEdit = (choice: QuestionChoice) => {
    setEditingChoiceId(choice.id);
    setEditValue(choice.label);
  };

  const handleSaveEdit = () => {
    if (editingChoiceId && editValue.trim()) {
      onEditChoice(editingChoiceId, editValue);
      setEditingChoiceId(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingChoiceId(null);
    setEditValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="space-y-2">
      {choices.map((choice) => (
        <div
          key={choice.id}
          className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
        >
          {editingChoiceId === choice.id ? (
            <div className="flex-1 flex items-center space-x-2">
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveEdit}
                className="h-7 w-7 p-0"
                disabled={!editValue.trim()}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelEdit}
                className="h-7 w-7 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <span>{choice.label}</span>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleStartEdit(choice)}
                  className="h-7 w-7 p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveChoice(choice.id)}
                  className="h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChoiceList;
