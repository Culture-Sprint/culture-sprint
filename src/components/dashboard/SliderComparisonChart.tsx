
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react";
import { Story } from "@/types/story";
import { useSliderQuestions, SliderQuestion, useChartData, useParticipantFilters } from "./slider-comparison/useSliderQuestions";
import FilterControls from "./slider-comparison/FilterControls";
import ChartContent from "./slider-comparison/ChartContent";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface SliderComparisonChartProps {
  stories: Story[];
}

const SliderComparisonChart: React.FC<SliderComparisonChartProps> = ({ stories }) => {
  // Get all available slider questions directly from the stories
  const sliderQuestions = useSliderQuestions(stories);
  
  // Get all available participant questions for filtering
  const participantFilters = useParticipantFilters(stories);
  
  // State for selected questions
  const [xAxisQuestion, setXAxisQuestion] = useState<number | null>(null);
  const [yAxisQuestion, setYAxisQuestion] = useState<number | null>(null);
  
  // State for participant filters
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  
  // Get chart data and labels based on selected questions
  const { xAxisLabels, yAxisLabels, chartData } = useChartData(
    stories, 
    xAxisQuestion, 
    yAxisQuestion, 
    sliderQuestions,
    filters
  );
  
  // Handle axis question selection
  const handleXAxisChange = (value: string) => {
    console.log("X-Axis changed to:", value);
    setXAxisQuestion(Number(value));
  };
  
  const handleYAxisChange = (value: string) => {
    console.log("Y-Axis changed to:", value);
    setYAxisQuestion(Number(value));
  };
  
  const hasInsufficientQuestions = sliderQuestions.length < 2;
  
  console.log("SliderComparisonChart rendering with:", {
    sliderQuestionsCount: sliderQuestions.length,
    sliderQuestionsSample: sliderQuestions.slice(0, 2).map(q => ({ id: q.id, text: q.text.substring(0, 30) + "..." })),
    xAxisQuestion,
    yAxisQuestion,
    storiesCount: stories.length
  });
  
  return (
    <Card className="shadow-md border-opacity-50">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-primary">
            <SlidersHorizontal className="mr-2 h-5 w-5 inline" />
            Slider Comparison
          </CardTitle>
          <InfoTooltip contentKey="dashboard-slider-comparison" size={16} />
        </div>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-culturesprint-50/30 rounded-b-md pt-8">
        <FilterControls 
          sliderQuestions={sliderQuestions}
          xAxisQuestion={xAxisQuestion}
          yAxisQuestion={yAxisQuestion}
          onXAxisChange={handleXAxisChange}
          onYAxisChange={handleYAxisChange}
        />
        
        <ChartContent 
          chartData={chartData} 
          xAxisLabels={xAxisLabels} 
          yAxisLabels={yAxisLabels}
          participantFilters={participantFilters}
          isEmpty={hasInsufficientQuestions}
        />
      </CardContent>
    </Card>
  );
};

export default SliderComparisonChart;
