
import React, { useState, useMemo } from "react";
import { ParticipantFilter } from "./useSliderQuestions";
import DataPointStats from "./DataPointStats";
import ScatterPlotChart from "./ScatterPlotChart";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ChartDisplayProps {
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
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ 
  chartData, 
  xAxisLabels, 
  yAxisLabels,
  participantFilters 
}) => {
  const [colorByEmotions, setColorByEmotions] = useState(false);
  const [filters, setFilters] = useState<Record<string, Set<string>>>({});
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});

  const handleColorToggleChange = (checked: boolean) => {
    setColorByEmotions(checked);
  };

  const toggleFilter = (filterId: string) => {
    setExpandedFilters(prev => {
      const newExpandedState = {
        ...prev,
        [filterId]: !prev[filterId]
      };
      
      // If we're collapsing a filter, clear all its checkboxes
      if (!newExpandedState[filterId]) {
        setFilters(currentFilters => {
          const updatedFilters = { ...currentFilters };
          if (updatedFilters[filterId]) {
            // Clear this filter's selections
            updatedFilters[filterId] = new Set();
          }
          return updatedFilters;
        });
      }
      
      return newExpandedState;
    });
  };

  const handleFilterChange = (questionId: string, choice: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (!newFilters[questionId]) {
        newFilters[questionId] = new Set();
      }
      
      if (newFilters[questionId].has(choice)) {
        newFilters[questionId].delete(choice);
      } else {
        newFilters[questionId].add(choice);
      }
      
      return newFilters;
    });
  };

  const filteredChartData = useMemo(() => {
    if (Object.values(filters).every(choiceSet => choiceSet.size === 0)) {
      return chartData;
    }

    return chartData.filter(point => {
      for (const [questionId, selectedChoices] of Object.entries(filters)) {
        if (selectedChoices.size === 0) continue;
        
        const participantResponse = point.participantResponses?.find(
          (r: any) => r.question_id === questionId
        );
        
        if (!participantResponse || !selectedChoices.has(participantResponse.response)) {
          return false;
        }
      }
      return true;
    });
  }, [chartData, filters]);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 animate-fade-in">
        Select questions for both axes to visualize the comparison
      </div>
    );
  }

  return (
    <div className="relative animate-fade-in">
      {/* Data points stats at the top right */}
      <div className="flex justify-end mb-4">
        <DataPointStats 
          filteredCount={filteredChartData.length} 
          totalCount={chartData.length} 
        />
      </div>

      {/* Chart in the middle */}
      <ScatterPlotChart
        chartData={filteredChartData}
        xAxisLabels={xAxisLabels}
        yAxisLabels={yAxisLabels}
        colorByEmotions={colorByEmotions}
      />

      {/* Controls at the bottom */}
      <div className="mt-6 border-t pt-4 border-culturesprint-100">
        <div className="space-y-4">
          {/* Color by emotions toggle with legend on the same line */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <Switch 
                id="color-toggle" 
                checked={colorByEmotions} 
                onCheckedChange={handleColorToggleChange} 
              />
              <Label htmlFor="color-toggle">Color by emotions</Label>
            </div>
            
            {colorByEmotions && (
              <div className="flex items-center gap-4 ml-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Negative</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Individual filter toggles for each participant filter */}
          {participantFilters.map(filter => (
            <div key={filter.id} className="flex items-center flex-wrap">
              <div className="flex items-center space-x-2">
                <Switch 
                  id={`filter-${filter.id}`} 
                  checked={expandedFilters[filter.id] || false}
                  onCheckedChange={() => toggleFilter(filter.id)}
                />
                <Label htmlFor={`filter-${filter.id}`}>
                  Filter by {filter.text}
                </Label>
              </div>
              
              {expandedFilters[filter.id] && (
                <div className="flex flex-wrap gap-3 ml-4">
                  {filter.choices.map(choice => {
                    const isActive = filters[filter.id]?.has(choice) || false;
                    return (
                      <div key={`${filter.id}-${choice}`} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`${filter.id}-${choice}`} 
                          checked={isActive}
                          onCheckedChange={() => handleFilterChange(filter.id, choice)}
                          className="h-5 w-5"
                        />
                        <label 
                          htmlFor={`${filter.id}-${choice}`} 
                          className={`text-sm cursor-pointer transition-colors duration-200 ${isActive ? "text-brand-primary font-medium" : "text-gray-600"}`}
                        >
                          {choice}
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartDisplay;
