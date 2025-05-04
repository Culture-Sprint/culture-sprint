
import React from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PolaritySliderProps {
  leftLabel: string;
  rightLabel: string;
  sliderValue: number;
  isEditing: boolean;
  editedLeftLabel: string;
  editedRightLabel: string;
  editedSliderValue: number;
  setEditedLeftLabel: (label: string) => void;
  setEditedRightLabel: (label: string) => void;
  handleSliderChange: (value: number[]) => void;
}

const PolaritySlider: React.FC<PolaritySliderProps> = ({
  leftLabel,
  rightLabel,
  sliderValue,
  isEditing,
  editedLeftLabel,
  editedRightLabel,
  editedSliderValue,
  setEditedLeftLabel,
  setEditedRightLabel,
  handleSliderChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between mb-1">
        {isEditing ? (
          <>
            <Input 
              value={editedLeftLabel} 
              onChange={(e) => setEditedLeftLabel(e.target.value)}
              className="w-24 text-xs text-gray-500 mr-2"
            />
            <Input 
              value={editedRightLabel} 
              onChange={(e) => setEditedRightLabel(e.target.value)}
              className="w-24 text-xs text-gray-500 ml-2"
            />
          </>
        ) : (
          <>
            <Label className="text-xs text-gray-500">{leftLabel}</Label>
            <Label className="text-xs text-gray-500">{rightLabel}</Label>
          </>
        )}
      </div>
      <Slider 
        defaultValue={[sliderValue]} 
        value={[isEditing ? editedSliderValue : sliderValue]} 
        onValueChange={handleSliderChange}
        max={100} 
        step={1} 
      />
    </div>
  );
};

export default PolaritySlider;
