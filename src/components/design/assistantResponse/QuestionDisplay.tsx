import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import ManualEditQuestion from "./ManualEditQuestion";
import { Pencil } from "lucide-react";
interface QuestionDisplayProps {
  question: string;
  mode: 'general' | 'storyQuestion';
  onSave?: (question: string) => void;
  saved?: boolean;
  isEditMode?: boolean;
  onEditClick?: () => void;
  onCancelEdit?: () => void;
}
const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  mode,
  onSave,
  saved = false,
  isEditMode = false,
  onEditClick,
  onCancelEdit
}) => {
  // Debug log to help with troubleshooting
  useEffect(() => {
    console.log("QuestionDisplay rendering:", {
      questionLength: question?.length,
      questionPreview: question?.substring(0, 50),
      mode,
      saved,
      isEditMode
    });
  }, [question, mode, saved, isEditMode]);
  if (!question) {
    return null;
  }
  return <div className="relative">
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-medium text-gray-500">
          {mode === 'storyQuestion' ? saved ? 'Saved Story Question:' : 'Suggested Story Question:' : 'Assistant Response:'}
        </p>
        {saved && mode === 'storyQuestion' && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Saved
          </Badge>}
      </div>
      
      {isEditMode && onSave ? <ManualEditQuestion question={question} onSave={onSave} onCancel={onCancelEdit} /> : <div className="relative">
          <div className="text-black whitespace-pre-wrap pr-10 mt-2 font-medium">
            {question}
          </div>
          {mode === 'storyQuestion' && onEditClick && <button onClick={onEditClick} className="absolute right-0 top-0 flex items-center bg-brand-background text-brand-primary font-normal text-sm rounded-none px-[7px] py-[3px]">
              <Pencil size={14} className="mr-1" />
              Edit
            </button>}
        </div>}
    </div>;
};
export default QuestionDisplay;