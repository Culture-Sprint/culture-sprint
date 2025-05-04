
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";

interface ManualEditQuestionProps {
  question: string;
  onSave: (question: string) => void;
  onCancel?: () => void;
}

const ManualEditQuestion: React.FC<ManualEditQuestionProps> = ({ 
  question, 
  onSave,
  onCancel
}) => {
  const [editedQuestion, setEditedQuestion] = useState(question);
  
  const handleSave = () => {
    if (editedQuestion.trim()) {
      onSave(editedQuestion.trim());
    }
  };
  
  return (
    <div className="space-y-3">
      <Textarea
        value={editedQuestion}
        onChange={(e) => setEditedQuestion(e.target.value)}
        className="min-h-[100px] w-full text-black bg-white border-gray-300 focus:border-culturesprint-300 focus:ring-culturesprint-200"
        placeholder="Edit the story question..."
      />
      
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
        )}
        
        <Button
          type="button"
          onClick={handleSave}
          className="bg-culturesprint-600 hover:bg-culturesprint-700 text-white flex items-center gap-1"
        >
          <Save className="h-4 w-4" />
          Save Edits
        </Button>
      </div>
    </div>
  );
};

export default ManualEditQuestion;
