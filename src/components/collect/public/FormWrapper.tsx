
import React from "react";
import { FormProvider } from "@/contexts/form";
import StoryForm from "@/components/collect/StoryForm";
import { StoryData } from "@/hooks/collect/form-submission/types";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { FormErrorFallback } from "@/components/ui/form-error-fallback";

interface FormWrapperProps {
  storyQuestion: string;
  sliderQuestions: any[];
  participantQuestions: any[];
  onSubmit: (data: StoryData) => Promise<boolean>;
  refreshTrigger: number;
  handleRefresh: () => void;
}

const FormWrapper: React.FC<FormWrapperProps> = ({
  storyQuestion,
  sliderQuestions,
  participantQuestions,
  onSubmit,
  refreshTrigger,
  handleRefresh
}) => {
  return (
    <ErrorBoundary
      fallback={
        <FormErrorFallback 
          title="Form Error" 
          message="There was a problem with the form. Please try reloading the page."
          resetError={handleRefresh}
        />
      }
    >
      <FormProvider 
        initialValues={{
          storyQuestion: storyQuestion || "",
          sliderQuestions: sliderQuestions || [], 
          participantQuestions: participantQuestions || []
        }}
        onSubmit={onSubmit}
        key={`form-provider-${refreshTrigger}`}
      >
        <StoryForm isPublic={true} />
      </FormProvider>
    </ErrorBoundary>
  );
};

export default FormWrapper;
