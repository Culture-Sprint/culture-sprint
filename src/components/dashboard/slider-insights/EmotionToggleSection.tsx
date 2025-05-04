
import React from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import EmotionColorToggle from "./EmotionColorToggle";

interface EmotionToggleSectionProps {
  colorByEmotions: boolean;
  setColorByEmotions: (value: boolean) => void;
  isProcessing: boolean;
  processingComplete: boolean;
}

const EmotionToggleSection: React.FC<EmotionToggleSectionProps> = ({
  colorByEmotions,
  setColorByEmotions,
  isProcessing,
  processingComplete
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <EmotionColorToggle 
          colorByEmotions={colorByEmotions}
          onToggleChange={setColorByEmotions}
        />
        
        {isProcessing && (
          <div className="flex items-center ml-3">
            <Loader2 className="h-4 w-4 mr-1 text-primary animate-spin" />
            <span className="text-sm text-gray-600">Processing emotions...</span>
          </div>
        )}
        
        {processingComplete && colorByEmotions && !isProcessing && (
          <div className="flex items-center ml-3">
            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-sm text-green-600">Processing complete</span>
          </div>
        )}
      </div>
      
      {colorByEmotions && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Positive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Negative</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionToggleSection;
