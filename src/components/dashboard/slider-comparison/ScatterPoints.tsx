
import React, { useState } from "react";
import { getPointColor } from "./utils";
import StoryDialog from "@/components/explore/StoryDialog";
import { Story } from "@/types/story";

interface ScatterPointsProps {
  cx?: number;
  cy?: number;
  fill?: string;
  payload?: {
    feeling?: string;
    feelingSentiment?: "positive" | "neutral" | "negative";
    storyData?: Story;
  };
  colorByEmotions?: boolean;
}

const ScatterPoints: React.FC<ScatterPointsProps> = (props) => {
  const { cx = 0, cy = 0, payload, colorByEmotions = false } = props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  let pointColor = "#9E9E9E"; // Default gray color
  
  if (colorByEmotions && payload) {
    // First try to use the sentiment field if available
    if (payload.feelingSentiment) {
      if (payload.feelingSentiment === "positive") {
        pointColor = "#4CAF50"; // Green
      } else if (payload.feelingSentiment === "negative") {
        pointColor = "#F44336"; // Red
      } else if (payload.feelingSentiment === "neutral") {
        pointColor = "#2196F3"; // Blue
      }
    } 
    // Fallback to feeling text if sentiment is not available
    else if (payload.feeling) {
      pointColor = getPointColor(payload.feeling);
    }
  }
  
  const handlePointClick = () => {
    if (payload?.storyData) {
      setIsDialogOpen(true);
    }
  };
  
  return (
    <>
      <circle 
        cx={cx} 
        cy={cy} 
        r={6} 
        fill={pointColor} 
        strokeWidth={1} 
        stroke="#ffffff"
        style={{ cursor: payload?.storyData ? 'pointer' : 'default' }}
        onClick={handlePointClick}
      />
      
      {payload?.storyData && isDialogOpen && (
        <StoryDialog
          story={payload.storyData}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ScatterPoints;
