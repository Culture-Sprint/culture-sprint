
import React from "react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded-md shadow-md">
        <p className="font-medium text-sm">{data.storyTitle}</p>
      </div>
    );
  }
  
  return null;
};

export default CustomTooltip;
