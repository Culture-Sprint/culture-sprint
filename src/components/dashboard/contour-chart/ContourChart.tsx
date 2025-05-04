
import React, { useRef, useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FormErrorFallback } from "@/components/ui/form-error-fallback";
import { useContourChart } from "./useContourChart";
import { Story } from "@/types/story";
import { SliderQuestion } from "../slider-comparison/useSliderQuestions";

interface ContourChartProps {
  stories: Story[];
  isLoading: boolean;
  xAxisQuestion: number | null;
  yAxisQuestion: number | null;
  sliderQuestions: SliderQuestion[];
}

const ContourChart: React.FC<ContourChartProps> = ({
  stories,
  isLoading,
  xAxisQuestion,
  yAxisQuestion,
  sliderQuestions
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartError, setChartError] = useState<Error | null>(null);
  
  const { dimensions, chartData } = useContourChart(
    chartRef, 
    stories, 
    isLoading, 
    xAxisQuestion, 
    yAxisQuestion, 
    sliderQuestions
  );
  
  const chartDescription = !xAxisQuestion || !yAxisQuestion 
    ? "Please select both X and Y axis questions above to visualize the data." 
    : "This contour chart shows the density of stories based on the selected slider questions. Lines represent areas of similar density, with thicker lines indicating higher concentrations.";
  
  const bothAxesSelected = xAxisQuestion !== null && yAxisQuestion !== null;
  const chartHeight = bothAxesSelected ? "h-[450px]" : "h-[25px]";
  const hasEnoughData = chartData.length >= 3;

  // If there's an error, show fallback
  if (chartError) {
    return (
      <FormErrorFallback 
        error={chartError}
        title="Chart Rendering Error"
        message="There was a problem generating the contour chart."
        resetError={() => setChartError(null)}
      />
    );
  }
  
  return (
    <div className="mt-6">
      <div className="text-gray-500 text-center text-base pb-4">
        {chartDescription}
      </div>
      <ErrorBoundary
        fallback={
          <FormErrorFallback
            title="Chart Error"
            message="An error occurred while rendering the chart. Please try changing your selections or refreshing the page."
          />
        }
        componentName="ContourChart"
      >
        <div
          ref={chartRef}
          className={`${chartHeight} w-full transition-all duration-300`}
        >
          {bothAxesSelected && !hasEnoughData && !isLoading && (
            <div className="h-full flex items-center justify-center text-gray-500">
              Not enough data points to generate a contour chart. Need at least 3 stories with responses to both selected questions.
            </div>
          )}
          <svg width="100%" height="100%" className="pt-5"></svg>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default ContourChart;
