import React, { createContext, useContext, useEffect } from "react";
import { FormContextType, FormProviderProps } from "./types";
import { useFormInitialization } from "./useFormInitialization";
import { useFormHandlers } from "./useFormHandlers";

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<FormProviderProps> = ({ children, initialValues, onSubmit }) => {
  // Debug participant questions when FormProvider is created
  useEffect(() => {
    console.log("FormProvider - Initializing with:", {
      storyQuestion: initialValues.storyQuestion ? "Present" : "Missing",
      sliderQuestionsCount: initialValues.sliderQuestions?.length || 0,
      participantQuestionsCount: initialValues.participantQuestions?.length || 0,
      sliderQuestions: initialValues.sliderQuestions?.map(q => ({
        id: q.id, 
        question: q.question?.substring(0, 30)
      }))
    });
  }, [initialValues]);
  
  // Initialize form state
  const formState = useFormInitialization(
    initialValues.sliderQuestions,
    initialValues.participantQuestions
  );
  
  // Set up form handlers
  const handlers = useFormHandlers({
    ...formState,
    sliderQuestions: initialValues.sliderQuestions,
    participantQuestions: initialValues.participantQuestions,
    onSubmit
  });
  
  // Create proper wrapped handlers that match the type signatures
  const updateSliderValue = (id: string | number, value: number | null) => {
    // Convert id to number if needed for the internal implementation
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    // Call the internal implementation
    formState.setSliderValues(prev => ({
      ...prev,
      [numericId]: value
    }));
  };
  
  const handleSliderChange = (id: number | string, value: number[] | "n/a") => {
    // Convert id to number if needed
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    // Handle the n/a case
    if (value === "n/a") {
      formState.setSliderValues(prev => ({
        ...prev,
        [numericId]: "n/a"
      }));
      return;
    }
    
    // Handle the array case - take the first value
    const numericValue = value[0] || 50;
    formState.setSliderValues(prev => ({
      ...prev,
      [numericId]: numericValue
    }));
  };

  // Debug participant answers on changes
  useEffect(() => {
    console.log("FormContext - Current participant answers:", formState.participantAnswers);
  }, [formState.participantAnswers]);
  
  const value: FormContextType = {
    storyQuestion: initialValues.storyQuestion,
    storyText: formState.storyText,
    setStoryText: formState.setStoryText,
    storyTitle: formState.storyTitle,
    setStoryTitle: formState.setStoryTitle,
    feeling: formState.feeling,
    setFeeling: formState.setFeeling,
    otherFeeling: formState.otherFeeling,
    setOtherFeeling: formState.setOtherFeeling,
    additionalComments: formState.additionalComments,
    setAdditionalComments: formState.setAdditionalComments,
    sliderQuestions: initialValues.sliderQuestions,
    sliderValues: formState.sliderValues,
    updateSliderValue,
    handleSliderChange,
    touchedSliders: formState.touchedSliders,
    setTouchedSliders: formState.setTouchedSliders,
    participantQuestions: initialValues.participantQuestions,
    participantValues: handlers.participantValues || {},
    updateParticipantValue: handlers.updateParticipantValue,
    participantAnswers: formState.participantAnswers,
    handleParticipantAnswerChange: handlers.handleParticipantAnswerChange,
    isSubmitting: formState.isSubmitting,
    isValid: true,
    handleSubmit: handlers.handleSubmit,
    onSubmit
  };
  
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};
