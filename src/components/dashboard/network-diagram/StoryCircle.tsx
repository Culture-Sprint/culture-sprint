
import React from "react";
import { NodeData } from "./types";

interface StoryCircleProps {
  node: NodeData;
  onClick: () => void;
  isSelected: boolean;
  viewMode: 'sentiment' | 'theme';
}

const StoryCircle: React.FC<StoryCircleProps> = ({ 
  node, 
  onClick, 
  isSelected,
  viewMode
}) => {
  const radius = Math.max(20, Math.min(40, node.z * 3)); // Scale the radius based on impact
  const circleStyle = {
    position: 'absolute' as const, // Type assertion to make TypeScript happy
    left: node.x,
    top: node.y,
    width: radius * 2,
    height: radius * 2,
    marginLeft: -radius,
    marginTop: -radius,
    backgroundColor: node.fill,
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    zIndex: isSelected ? 10 : 'auto',
    transform: isSelected ? 'scale(1.1)' : 'none',
    boxShadow: isSelected 
      ? '0 0 0 4px rgba(24, 5, 114, 0.5), 0 4px 10px rgba(0, 0, 0, 0.2)' 
      : '0 2px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div
      className={`hover:ring-4 hover:ring-opacity-50 hover:z-10 hover:scale-110 hover:shadow-lg
                 ${viewMode === 'sentiment' ? 'hover:ring-accent' : 'hover:ring-primary'}`}
      style={circleStyle}
      onClick={onClick}
      title={node.name}
    >
      <div className="absolute inset-0 rounded-full opacity-20 bg-white"></div>
      <div className="text-xs text-white font-semibold truncate max-w-[90%] text-center">
        {/* For smaller circles, just show initials */}
        {radius < 30 ? node.name.charAt(0) : node.name.length > 10 ? `${node.name.substring(0, 10)}...` : node.name}
      </div>
    </div>
  );
};

export default StoryCircle;
