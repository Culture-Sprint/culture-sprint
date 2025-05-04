
import { useState, useEffect } from "react";
import { SliderQuestion, ParticipantQuestion } from "@/services/types/designTypes";

export const useFormInitialization = (
  sliderQuestions: SliderQuestion[],
  participantQuestions: ParticipantQuestion[]
) => {
  // Story text and title
  const [storyText, setStoryText] = useState<string>("");
  const [storyTitle, setStoryTitle] = useState<string>("");
  
  // Emotional response
  const [feeling, setFeeling] = useState<string>("");
  const [otherFeeling, setOtherFeeling] = useState<string>("");
  
  // Additional comments
  const [additionalComments, setAdditionalComments] = useState<string>("");
  
  // Slider values - initialize with empty object
  const [sliderValues, setSliderValues] = useState<Record<string | number, number | null | "n/a">>({});
  
  // Tracked which sliders have been touched
  const [touchedSliders, setTouchedSliders] = useState<Set<number>>(new Set());
  
  // Participant answers - initialize with empty object
  const [participantAnswers, setParticipantAnswers] = useState<Record<string, string>>({});
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // Debug participant questions when this hook is called
  useEffect(() => {
    console.log("useFormInitialization - With participant questions:", participantQuestions);
  }, [participantQuestions]);

  return {
    storyText,
    setStoryText,
    storyTitle,
    setStoryTitle,
    feeling,
    setFeeling,
    otherFeeling,
    setOtherFeeling,
    additionalComments,
    setAdditionalComments,
    sliderValues,
    setSliderValues,
    touchedSliders,
    setTouchedSliders,
    participantAnswers,
    setParticipantAnswers,
    isSubmitting,
    setIsSubmitting
  };
};
