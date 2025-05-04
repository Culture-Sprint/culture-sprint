
import React, { useState } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FormErrorFallback } from "@/components/ui/form-error-fallback";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CustomTooltip from "./CustomTooltip";
import ScatterPoints from "./ScatterPoints";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/toast";

interface ScatterPlotChartProps {
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
  colorByEmotions: boolean;
}

const ScatterPlotChart: React.FC<ScatterPlotChartProps> = ({
  chartData,
  xAxisLabels,
  yAxisLabels,
  colorByEmotions
}) => {
  const [chartError, setChartError] = useState<Error | null>(null);
  const [attemptingRetry, setAttemptingRetry] = useState(false);

  // Handler for chart errors
  const handleChartError = (err: Error) => {
    console.error("Scatter plot error:", err);
    setChartError(err);
  };

  // Reset error and retry rendering the chart
  const handleRetry = () => {
    setAttemptingRetry(true);
    
    // Short delay to allow React to re-render
    setTimeout(() => {
      setChartError(null);
      setAttemptingRetry(false);
      toast({
        title: "Chart Refreshed",
        description: "The visualization has been refreshed.",
        variant: "info"
      });
    }, 500);
  };

  if (attemptingRetry) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p>Refreshing visualization...</p>
        </div>
      </div>
    );
  }

  if (chartError) {
    return (
      <FormErrorFallback 
        error={chartError}
        title="Chart Error"
        message="There was a problem displaying the scatter plot chart."
        resetError={handleRetry}
        componentName="ScatterPlotChart"
        action={
          <Button 
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Chart
          </Button>
        }
      />
    );
  }

  return (
    <div className="h-[400px]">
      <ErrorBoundary
        fallback={
          <FormErrorFallback
            title="Chart Error"
            message="An error occurred while rendering the chart. Please try changing the selections or refreshing."
            componentName="ScatterPlotChart"
            action={
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            }
          />
        }
        componentName="ScatterPlotChart"
        onError={handleChartError}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={xAxisLabels.text}
              domain={[0, 100]}
              tickCount={5} 
              label={{ 
                value: xAxisLabels.text, 
                position: 'bottom', 
                offset: 20,
                style: { textAnchor: 'middle' }
              }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={yAxisLabels.text}
              domain={[0, 100]}
              tickCount={5}
              label={{ 
                value: yAxisLabels.text, 
                angle: -90, 
                position: 'left', 
                offset: 10,
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter 
              name="Slider Comparison" 
              data={chartData} 
              fill="#8884d8"
              shape={<ScatterPoints colorByEmotions={colorByEmotions} />}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ErrorBoundary>
    </div>
  );
};

export default ScatterPlotChart;
