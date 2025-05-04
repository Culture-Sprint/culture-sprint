
import React, { useState } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FormErrorFallback } from "@/components/ui/form-error-fallback";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { HistogramBin } from "./histogramUtils";
import CustomHistogramBar from "./CustomHistogramBar";

interface DistributionHistogramProps {
  histogramData: HistogramBin[];
  leftLabel?: string;
  rightLabel?: string;
  questionText: string;
  colorByEmotions: boolean;
  setColorByEmotions: (value: boolean) => void;
  isProcessing: boolean;
  processingComplete: boolean;
}

const DistributionHistogram: React.FC<DistributionHistogramProps> = ({
  histogramData,
  leftLabel = "Low",
  rightLabel = "High",
  questionText,
  colorByEmotions,
  setColorByEmotions,
  isProcessing,
  processingComplete
}) => {
  const [chartError, setChartError] = useState<Error | null>(null);
  const totalResponses = histogramData.reduce((sum, bin) => sum + bin.count, 0);

  // Reset chart error
  const handleResetError = () => {
    setChartError(null);
  };

  // Show fallback if we have a chart error
  if (chartError) {
    return (
      <div className="mt-8">
        <FormErrorFallback
          error={chartError}
          title="Histogram Error"
          message={`There was a problem rendering the histogram for "${questionText}".`}
          resetError={handleResetError}
        />
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="text-sm font-medium text-center mb-2">
        Distribution for "{questionText}"
      </div>
      
      {totalResponses === 0 ? (
        <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed">
          <p className="text-gray-500">No data matches the current filters</p>
        </div>
      ) : (
        <div className="h-[200px]">
          <ErrorBoundary
            fallback={
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-md border border-red-100">
                <p className="text-red-500">Failed to render chart. Please try again.</p>
              </div>
            }
            componentName={`Histogram-${questionText}`}
            onError={(err) => setChartError(err)}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'count') return [`${value} responses`, 'Count'];
                    if (colorByEmotions && (name === 'positive' || name === 'negative' || name === 'neutral')) {
                      return [`${value} ${name}`, name];
                    }
                    return [`${value}`, name];
                  }}
                  labelFormatter={(label) => `Range: ${label}`}
                />
                <Bar 
                  dataKey="count" 
                  fill="#180572" 
                  shape={(props) => (
                    <CustomHistogramBar 
                      {...props} 
                      colorByEmotions={colorByEmotions} 
                      positive={histogramData[props.index || 0]?.positive || 0}
                      negative={histogramData[props.index || 0]?.negative || 0}
                      neutral={histogramData[props.index || 0]?.neutral || 0}
                      count={histogramData[props.index || 0]?.count || 0}
                    />
                  )} 
                />
              </BarChart>
            </ResponsiveContainer>
          </ErrorBoundary>
        </div>
      )}
      
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default DistributionHistogram;
