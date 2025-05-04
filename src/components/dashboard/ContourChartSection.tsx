
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Story } from "@/types/story";
import FilterControls from "./slider-comparison/FilterControls";
import { useSliderQuestions, SliderQuestion } from "./slider-comparison/useSliderQuestions";
import EmptyStateAlert from "./slider-comparison/EmptyStateAlert";
import ContourChart from "./contour-chart/ContourChart";
import LoadingState from "./contour-chart/LoadingState";
import EmptyState from "./contour-chart/EmptyState";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface ContourChartSectionProps {
  stories: Story[];
  isLoading: boolean;
}

const ContourChartSection: React.FC<ContourChartSectionProps> = ({
  stories,
  isLoading
}) => {
  // Get all available slider questions from the stories
  const sliderQuestions = useSliderQuestions(stories);

  // State for selected questions
  const [xAxisQuestion, setXAxisQuestion] = useState<number | null>(null);
  const [yAxisQuestion, setYAxisQuestion] = useState<number | null>(null);

  // Handle axis question selection
  const handleXAxisChange = (value: string) => {
    console.log("Contour X-Axis changed to:", value);
    setXAxisQuestion(Number(value));
  };
  const handleYAxisChange = (value: string) => {
    console.log("Contour Y-Axis changed to:", value);
    setYAxisQuestion(Number(value));
  };
  
  const hasInsufficientQuestions = sliderQuestions.length < 2;
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (!stories.length) {
    return <EmptyState />;
  }
  
  return <Card className="shadow-md border-opacity-50 h-full">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-primary">
            <TrendingUp className="mr-2 h-5 w-5 inline" />
            Story Density Contour Chart
          </CardTitle>
          <InfoTooltip contentKey="dashboard-contour-chart" size={16} />
        </div>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-culturesprint-50/30 rounded-b-md pt-8">
        <FilterControls sliderQuestions={sliderQuestions} xAxisQuestion={xAxisQuestion} yAxisQuestion={yAxisQuestion} onXAxisChange={handleXAxisChange} onYAxisChange={handleYAxisChange} />
        
        {hasInsufficientQuestions ? <EmptyStateAlert message="Not enough slider questions with responses to generate a contour chart. You need at least two different slider questions with responses." /> : <ContourChart stories={stories} isLoading={isLoading} xAxisQuestion={xAxisQuestion} yAxisQuestion={yAxisQuestion} sliderQuestions={sliderQuestions} />}
      </CardContent>
    </Card>;
};

export default ContourChartSection;
