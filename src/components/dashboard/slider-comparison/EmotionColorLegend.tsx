
import React from "react";

const EmotionColorLegend: React.FC = () => {
  return (
    <div className="mt-8 border-t pt-4">
      <p className="text-sm font-medium mb-2 text-center">Point Color Legend</p>
      <div className="flex items-center gap-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span className="text-sm">Positive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span className="text-sm">Neutral</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span className="text-sm">Negative</span>
        </div>
      </div>
    </div>
  );
};

export default EmotionColorLegend;
