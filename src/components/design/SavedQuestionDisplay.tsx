import React from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
interface SavedQuestionDisplayProps {
  savedQuestion: string;
  onEditQuestion: () => void;
}
const SavedQuestionDisplay: React.FC<SavedQuestionDisplayProps> = ({
  savedQuestion,
  onEditQuestion
}) => {
  return <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Your Story Question</h3>
        <Button variant="ghost" size="sm" onClick={onEditQuestion} className="flex items-center gap-1 text-culturesprint-600 hover:text-culturesprint-700 bg-brand-background">
          <Pencil size={14} />
          Edit
        </Button>
      </div>
      
      <div className="bg-culturesprint-50 p-4 rounded-md">
        <p className="font-medium text-gray-800">{savedQuestion}</p>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
          Saved
        </span>
        <span>This question will be shown to participants when they share their stories.</span>
      </div>
    </div>;
};
export default SavedQuestionDisplay;