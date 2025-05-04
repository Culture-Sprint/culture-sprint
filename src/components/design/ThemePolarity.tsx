
import React, { useState, useEffect } from "react";
import ThemeHeader from "./slider-questions/ThemeHeader";
import ThemeQuestion from "./slider-questions/ThemeQuestion";
import PolaritySlider from "./slider-questions/PolaritySlider";

interface ThemePolarityProps {
  theme: string;
  question: string;
  leftLabel: string;
  rightLabel: string;
  sliderValue?: number;
  onEdit: (id: number) => void;
  onSave: (id: number, theme: string, question: string, leftLabel: string, rightLabel: string, sliderValue?: number) => void;
  onCancel: () => void;
  isEditing: boolean;
  id: number;
}

const ThemePolarity: React.FC<ThemePolarityProps> = ({
  theme,
  question,
  leftLabel,
  rightLabel,
  sliderValue = 50,
  onEdit,
  onSave,
  onCancel,
  isEditing,
  id
}) => {
  const [editedTheme, setEditedTheme] = useState(theme);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [editedLeftLabel, setEditedLeftLabel] = useState(leftLabel);
  const [editedRightLabel, setEditedRightLabel] = useState(rightLabel);
  const [editedSliderValue, setEditedSliderValue] = useState(sliderValue);

  // Reset form values when the props change or when editing is toggled
  useEffect(() => {
    if (isEditing) {
      setEditedTheme(theme);
      setEditedQuestion(question);
      setEditedLeftLabel(leftLabel);
      setEditedRightLabel(rightLabel);
      setEditedSliderValue(sliderValue);
    }
  }, [isEditing, theme, question, leftLabel, rightLabel, sliderValue]);

  const handleSave = () => {
    onSave(id, editedTheme, editedQuestion, editedLeftLabel, editedRightLabel, editedSliderValue);
  };

  const handleSliderChange = (value: number[]) => {
    setEditedSliderValue(value[0]);
  };

  return (
    <div className="space-y-4 mb-6 p-4 bg-white rounded-md shadow-sm border border-gray-100">
      <ThemeHeader
        theme={theme}
        isEditing={isEditing}
        editedTheme={editedTheme}
        setEditedTheme={setEditedTheme}
        onEdit={() => onEdit(id)}
        onSave={handleSave}
        onCancel={onCancel}
      />
      
      <ThemeQuestion
        question={question}
        isEditing={isEditing}
        editedQuestion={editedQuestion}
        setEditedQuestion={setEditedQuestion}
      />
      
      <div className="space-y-6">
        <PolaritySlider
          leftLabel={leftLabel}
          rightLabel={rightLabel}
          sliderValue={sliderValue}
          isEditing={isEditing}
          editedLeftLabel={editedLeftLabel}
          editedRightLabel={editedRightLabel}
          editedSliderValue={editedSliderValue}
          setEditedLeftLabel={setEditedLeftLabel}
          setEditedRightLabel={setEditedRightLabel}
          handleSliderChange={handleSliderChange}
        />
      </div>
    </div>
  );
};

export default ThemePolarity;
