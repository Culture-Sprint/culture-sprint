
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SlidersHorizontal } from "lucide-react";
import { useSliderInsights } from "./slider-insights/hooks/useSliderInsights";
import { prepareHistogramData } from "./slider-insights/histogramUtils";
import DistributionHistogram from "./slider-insights/DistributionHistogram";
import QuestionSelectorGrid from "./slider-insights/QuestionSelectorGrid";
import FilterSection from "./slider-insights/FilterSection";
import NoQuestionsMessage from "./slider-insights/NoQuestionsMessage";
import { InfoTooltip } from "@/components/ui/info-tooltip";

interface SliderInsightsSectionProps {
  stories: any[];
  isLoading: boolean;
  isPublic?: boolean;
  projectId?: string;
}

const SliderInsightsSection: React.FC<SliderInsightsSectionProps> = ({ 
  stories, 
  isLoading,
  isPublic = false,
  projectId
}) => {
  // State to track whether to color by emotions
  const [colorByEmotions, setColorByEmotions] = useState<boolean>(false);
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  
  // Use our custom hook to get all the slider data
  const {
    questionList,
    selectedQuestion,
    selectedQuestionId,
    setSelectedQuestionId,
    processedStories,
    isProcessing,
    processingComplete,
    participantFilters,
    loading: questionsLoading
  } = useSliderInsights(stories, colorByEmotions);
  
  // Prepare histogram data for the selected question
  const histogramData = selectedQuestion 
    ? prepareHistogramData(selectedQuestion, processedStories, filters, stories) 
    : [];
  
  if (isLoading) {
    return null;
  }
  
  return (
    <Card className="col-span-2 shadow-md border-opacity-50">
      <CardHeader className="bg-gradient-to-r from-culturesprint-50 to-culturesprint-100 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-primary">
            <SlidersHorizontal className="h-5 w-5 inline mr-2" />
            Slider Responses
          </CardTitle>
          <InfoTooltip contentKey="dashboard-slider-responses" size={16} />
        </div>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-culturesprint-50/30 rounded-b-md pt-8">
        {questionList.length === 0 && !questionsLoading ? (
          <NoQuestionsMessage />
        ) : (
          <div className="space-y-6 animate-fade-in">
            <QuestionSelectorGrid 
              questionList={questionList}
              selectedQuestionId={selectedQuestionId}
              setSelectedQuestionId={setSelectedQuestionId}
              loading={questionsLoading}
            />
            
            {selectedQuestion && (
              <DistributionHistogram
                histogramData={histogramData}
                leftLabel={selectedQuestion.left_label}
                rightLabel={selectedQuestion.right_label}
                questionText={selectedQuestion.question_text}
                colorByEmotions={colorByEmotions}
                setColorByEmotions={setColorByEmotions}
                isProcessing={isProcessing}
                processingComplete={processingComplete}
              />
            )}
            
            {selectedQuestion && (
              <FilterSection 
                colorByEmotions={colorByEmotions}
                setColorByEmotions={setColorByEmotions}
                isProcessing={isProcessing}
                processingComplete={processingComplete}
                participantFilters={participantFilters}
                filters={filters}
                setFilters={setFilters}
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SliderInsightsSection;
