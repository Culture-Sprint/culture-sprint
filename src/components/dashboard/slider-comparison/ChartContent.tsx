
import React from "react";
import { ParticipantFilter } from "./useSliderQuestions";
import ChartDisplay from "./ChartDisplay";
import EmptyStateAlert from "./EmptyStateAlert";

interface ChartContentProps {
  chartData: any[];
  xAxisLabels: {
    left: string;
    right: string;
    text: string;
  };
  yAxisLabels: {
    left: string;
    right: string;
    text: string;
  };
  participantFilters: ParticipantFilter[];
  isEmpty: boolean;
}

const ChartContent: React.FC<ChartContentProps> = ({
  chartData,
  xAxisLabels,
  yAxisLabels,
  participantFilters,
  isEmpty
}) => {
  if (isEmpty) {
    return (
      <EmptyStateAlert 
        message="Not enough slider questions with responses to generate a comparison chart. You need at least two different slider questions with responses." 
      />
    );
  }
  
  return (
    <ChartDisplay 
      chartData={chartData} 
      xAxisLabels={xAxisLabels} 
      yAxisLabels={yAxisLabels}
      participantFilters={participantFilters}
    />
  );
};

export default ChartContent;
