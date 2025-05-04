
import React from "react";
import { FormProvider } from "@/contexts/form";
import { useFormDataLoader } from "@/hooks/collect/useFormDataLoader";
import { useFormSubmissionHandler } from "@/hooks/collect/useFormSubmissionHandler";
import FormLoadingState from "@/components/collect/FormLoadingState";
import StoryForm from "@/components/collect/StoryForm";
import { StoryData } from "@/hooks/collect/form-submission/types";

interface FormContainerProps {
  projectId?: string | null;
}

const FormContainer: React.FC<FormContainerProps> = ({ projectId }) => {
  // Load form data with the loader for authenticated forms
  const formData = useFormDataLoader(projectId);
  const { handleFormSubmit, isSubmitting } = useFormSubmissionHandler(false);
  
  if (formData.isLoading) {
    return <FormLoadingState />;
  }
  
  // No default story question - explicitly use empty string when null
  const defaultStoryQuestion = "";
  
  // Create a wrapper for the onSubmit function to adapt the types
  const handleSubmit = async (data: StoryData): Promise<boolean> => {
    // Convert any non-boolean result to boolean
    const result = await handleFormSubmit(data);
    return result === true;
  };
  
  return (
    <FormProvider 
      initialValues={{
        storyQuestion: formData.storyQuestion || defaultStoryQuestion,
        sliderQuestions: formData.sliderQuestions || [], 
        participantQuestions: formData.participantQuestions || []
      }}
      onSubmit={handleSubmit}
    >
      <StoryForm />
    </FormProvider>
  );
};

export default FormContainer;
