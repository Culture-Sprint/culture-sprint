
import React from "react";
import { NodeData } from "../types";

interface StoryTooltipProps {
  story: NodeData;
  onClose: () => void;
  width: number;
  height: number;
}

const StoryTooltip: React.FC<StoryTooltipProps> = ({ story, onClose, width, height }) => {
  // Calculate optimal position for tooltip
  const position = {
    top: story.y > height / 2 ? story.y - 120 : story.y + 40,
    left: story.x > width / 2 ? story.x - 220 : story.x + 40,
  };

  return (
    <div 
      className="absolute bg-white p-3 rounded-lg shadow-lg border z-50 max-w-[280px] transition-all duration-200"
      style={{ 
        top: position.top,
        left: position.left,
      }}
      onClick={(e) => e.stopPropagation()} // Prevent clicks from bubbling to parent
    >
      <div className="font-bold truncate mb-1">{story.name}</div>
      
      {story.theme && (
        <div className="text-sm mt-1 flex items-center">
          <span className="font-medium mr-1">Theme:</span> 
          <span className="px-2 py-0.5 rounded-full text-xs" 
                style={{ backgroundColor: `${story.fill}30`, color: story.fill }}>
            {story.theme}
          </span>
        </div>
      )}
      
      {story.sentiment && story.sentiment !== "undefined" && (
        <div className="text-sm mt-1">
          <span className="font-medium">Sentiment:</span> {story.sentiment}
        </div>
      )}
      
      {story.z > 1 && (
        <div className="text-sm mt-1">
          <span className="font-medium">Impact:</span> {story.z}
        </div>
      )}
      
      <button 
        className="text-xs text-gray-500 mt-3 hover:text-gray-700 transition-colors py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-md w-full"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        Close
      </button>
    </div>
  );
};

export default StoryTooltip;
