
import React, { useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { SliderQuestion } from "@/services/types/designTypes";

interface SliderQuestionsProps {
  sliderQuestions: SliderQuestion[];
  sliderValues: Record<number, number | "n/a">;
  onSliderChange: (id: number, value: number[] | "n/a") => void;
  touchedSliders: Set<number>;
  setTouchedSliders: (updatedSet: Set<number>) => void;
}

const SliderQuestions: React.FC<SliderQuestionsProps> = ({
  sliderQuestions,
  sliderValues,
  onSliderChange,
  touchedSliders,
  setTouchedSliders
}) => {
  // Add a useEffect hook to log data when props change
  useEffect(() => {
    console.log("SliderQuestions - Props received:", {
      questionsCount: sliderQuestions?.length || 0,
      sliderValuesCount: Object.keys(sliderValues || {}).length,
      questions: sliderQuestions?.map(q => ({
        id: q.id,
        question: q.question?.substring(0, 30) + "..."
      })),
      sliderValues,
      touchedSliders: Array.from(touchedSliders || new Set())
    });
  }, [sliderQuestions, sliderValues, touchedSliders]);

  if (!sliderQuestions || sliderQuestions.length === 0) {
    console.log("SliderQuestions - No slider questions to display");
    return null;
  }

  // Clean up the questions to ensure proper formatting and remove any malformed questions
  const cleanedQuestions = sliderQuestions
    .filter(q => q && typeof q.question === 'string' && q.question.trim().length > 0)
    .map(question => {
      // Clean up the question text - fix any malformed text and ensure all fields are present
      const questionText = question.question
        ?.trim()
        .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
        .replace(/\.(.*?)\./, ". ") // Fix issues with multiple periods and text between them
        .replace(/(\.+ )/g, '. '); // Fix multiple dots
      
      // Create a cleaned question object
      const cleaned = {
        ...question,
        question: questionText || `Question ${question.id}`,
        leftLabel: question.leftLabel ? question.leftLabel.trim() : "Not at all",
        rightLabel: question.rightLabel ? question.rightLabel.trim() : "Very much",
        sliderValue: Number(question.sliderValue || 50)
      };
      
      console.log(`SliderQuestions - Cleaned question ID ${question.id}:`, {
        original: question.question,
        cleaned: cleaned.question
      });
      
      return cleaned;
    });

  return (
    <div className="border-t pt-6 mt-8">
      <h3 className="font-medium text-lg mb-6">About Your Experience</h3>
      <div className="space-y-10">
        {cleanedQuestions.map((question) => {
          // Get current value or use default (between 0-100)
          const defaultValue = question.sliderValue ? Math.min(question.sliderValue, 100) : 50;
          
          // Parse the slider value correctly
          let currentValue = sliderValues[question.id];
          let displayValue: number = typeof currentValue === "number" ? currentValue : defaultValue;
          
          // Handle cases where the value is undefined or incorrect
          if (currentValue === undefined) {
            currentValue = "n/a";
            displayValue = defaultValue;
          } else if (typeof currentValue === "number" && currentValue > 100) {
            // Fix for cases where values have extra zeros
            displayValue = Math.min(Math.round(currentValue / 10), 100);
            currentValue = displayValue;
          }
          
          console.log(`SliderQuestions - Rendering slider ${question.id}:`, {
            questionText: question.question,
            defaultValue,
            currentValue,
            touched: touchedSliders.has(question.id),
            originalSliderValue: sliderValues[question.id]
          });
          
          return (
            <div key={question.id} className="mb-2">
              <Label className="flex items-center gap-1 mb-4 text-base">
                <SlidersHorizontal className="h-4 w-4" />
                {question.question}
              </Label>
              <div className="px-2">
                <Slider
                  value={[displayValue]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => {
                    // Mark this slider as touched by the user
                    if (!touchedSliders.has(question.id)) {
                      const newTouchedSet = new Set(touchedSliders);
                      newTouchedSet.add(question.id);
                      setTouchedSliders(newTouchedSet);
                    }
                    
                    console.log(`SliderQuestions - Slider ${question.id} changed:`, {
                      from: currentValue,
                      to: value[0],
                      rawValue: value,
                      nowTouched: true
                    });
                    onSliderChange(question.id, value);
                  }}
                  className="my-8"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{question.leftLabel}</span>
                  <span>{question.rightLabel}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SliderQuestions;
