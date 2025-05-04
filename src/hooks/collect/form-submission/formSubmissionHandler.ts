
import { useState, useCallback } from 'react';
import { StoryData, FormSubmissionHandler } from './types';

/**
 * Hook for handling form submissions
 * @param onSubmit The submission function to execute
 * @returns Object with handler and state
 */
export const useFormHandler = (onSubmit: FormSubmissionHandler) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleFormSubmission = useCallback(async (data: StoryData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const result = await onSubmit(data);
      // Convert string results (like "demo-limit-reached") to boolean false
      return result === true;
    } catch (error) {
      console.error('Error in form submission:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [onSubmit]);
  
  return {
    handleFormSubmission,
    isSubmitting
  };
};
