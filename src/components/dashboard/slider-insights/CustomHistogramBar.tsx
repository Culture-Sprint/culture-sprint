
import React from "react";

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  colorByEmotions: boolean;
  positive: number;
  negative: number;
  neutral: number;
  count: number;
}

const CustomHistogramBar: React.FC<CustomBarProps> = (props) => {
  const { x = 0, y = 0, width = 0, height = 0, colorByEmotions, positive, negative, neutral, count } = props;
  
  if (!colorByEmotions) {
    return <rect x={x} y={y} width={width} height={height} fill="#180572" />;
  }
  
  // If no data or not using emotion coloring, return a regular bar
  if (count === 0) {
    return <rect x={x} y={y} width={width} height={height} fill="#180572" />;
  }
  
  // Calculate heights for each sentiment section
  const positiveRatio = positive / count;
  const negativeRatio = negative / count;
  const neutralRatio = neutral / count;
  
  const positiveHeight = height * positiveRatio;
  const negativeHeight = height * negativeRatio;
  const neutralHeight = height * neutralRatio;
  
  // Render stacked bars for each sentiment
  return (
    <g>
      {positiveRatio > 0 && (
        <rect 
          x={x} 
          y={y + height - positiveHeight} 
          width={width} 
          height={positiveHeight} 
          fill="#4CAF50" 
        />
      )}
      {neutralRatio > 0 && (
        <rect 
          x={x} 
          y={y + height - positiveHeight - neutralHeight} 
          width={width} 
          height={neutralHeight} 
          fill="#2196F3" 
        />
      )}
      {negativeRatio > 0 && (
        <rect 
          x={x} 
          y={y} 
          width={width} 
          height={negativeHeight} 
          fill="#F44336" 
        />
      )}
    </g>
  );
};

export default CustomHistogramBar;
