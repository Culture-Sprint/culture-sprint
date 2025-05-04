
import React from "react";
import { ParticipantFilter } from "../slider-comparison/useSliderQuestions";
import EmotionToggleSection from "./EmotionToggleSection";
import ParticipantFilters from "./ParticipantFilters";

interface FilterSectionProps {
  colorByEmotions: boolean;
  setColorByEmotions: (value: boolean) => void;
  isProcessing: boolean;
  processingComplete: boolean;
  participantFilters: ParticipantFilter[];
  filters: Record<string, Set<string>>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, Set<string>>>>;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  colorByEmotions,
  setColorByEmotions,
  isProcessing,
  processingComplete,
  participantFilters,
  filters,
  setFilters
}) => {
  return (
    <div className="mt-6 border-t pt-4 border-culturesprint-100">
      <div className="flex flex-col space-y-4">
        {/* Emotion color toggle with legend */}
        <EmotionToggleSection 
          colorByEmotions={colorByEmotions}
          setColorByEmotions={setColorByEmotions}
          isProcessing={isProcessing}
          processingComplete={processingComplete}
        />
        
        {/* Participant filters */}
        {participantFilters.length > 0 && (
          <ParticipantFilters 
            participantFilters={participantFilters}
            filters={filters}
            setFilters={setFilters}
          />
        )}
      </div>
    </div>
  );
};

export default FilterSection;
