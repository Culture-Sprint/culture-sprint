
import { useCallback } from "react";
import { SliderQuestion } from "@/services/types/designTypes";

export const useSliderQuestionEdit = () => {
  // Function to handle edit theme
  const handleEditTheme = useCallback((id: number) => {
    // Just return the id for tracking in parent component
    return id;
  }, []);

  // Function to handle save theme
  const handleSaveTheme = useCallback(
    (
      id: number,
      themeOrThemeObject: string | SliderQuestion,
      question?: string,
      leftLabel?: string,
      rightLabel?: string,
      sliderValue?: number
    ): SliderQuestion => {
      let updatedTheme: SliderQuestion;

      if (typeof themeOrThemeObject === "string") {
        // If the first argument is a string, it's the theme name
        updatedTheme = {
          id,
          theme: themeOrThemeObject,
          question: question || "",
          leftLabel: leftLabel || "",
          rightLabel: rightLabel || "",
          sliderValue: sliderValue || 50,
        };
      } else {
        // If the first argument is an object, it's the theme object
        updatedTheme = themeOrThemeObject;
      }

      // Return the updated theme object
      return updatedTheme;
    },
    []
  );

  // Function to handle cancel edit
  const handleCancelEdit = useCallback(() => {
    // No action needed here, parent component will handle state
    return;
  }, []);

  return {
    handleEditTheme,
    handleSaveTheme,
    handleCancelEdit,
  };
};
