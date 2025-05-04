
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface QuestionSelectorCardProps {
  id: number;
  questionText: string;
  average: number;
  responsesCount: number;
  leftLabel?: string;
  rightLabel?: string;
  isSelected: boolean;
  onClick: () => void;
  isDemo?: boolean; // Add isDemo prop
}

const QuestionSelectorCard: React.FC<QuestionSelectorCardProps> = ({
  id,
  questionText,
  average,
  responsesCount,
  leftLabel = "Low",
  rightLabel = "High",
  isSelected,
  onClick,
  isDemo = false // Default to false
}) => {
  return (
    <div 
      className={cn(
        "bg-white p-4 rounded-md transition-all cursor-pointer border relative",
        "hover:bg-culturesprint-50 hover:shadow-md",
        isSelected 
          ? "ring-2 ring-culturesprint-600 bg-culturesprint-50 shadow-md border-culturesprint-200" 
          : "border-culturesprint-100"
      )}
      onClick={onClick}
    >
      {isDemo && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-amber-500 rounded-full" 
             title="Demo Question"></div>
      )}
      <div className="text-sm font-medium mb-2 line-clamp-2 h-10" title={questionText}>
        {questionText}
      </div>
      <div className="flex justify-between items-center mb-1">
        <div className="text-2xl font-bold text-culturesprint-700">{average.toFixed(1)}</div>
        <Badge variant="secondary" className="bg-culturesprint-100 text-culturesprint-800 font-normal">
          {responsesCount} {responsesCount === 1 ? 'response' : 'responses'}
        </Badge>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default QuestionSelectorCard;
