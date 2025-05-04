
import { useToast } from "@/components/ui/use-toast";

interface CheckResults {
  hasStoryQuestion: boolean;
  hasSliderQuestions: boolean;
  hasParticipantQuestions: boolean;
}

export const useFormValidationToasts = () => {
  const { toast } = useToast();
  
  const showValidationToasts = (checkResults: CheckResults, showToasts: boolean) => {
    if (!showToasts) return;
    
    const { hasStoryQuestion, hasSliderQuestions, hasParticipantQuestions } = checkResults;

    if (!hasStoryQuestion) {
      toast({
        title: "Missing story question",
        description: "Please design a story question first in the 'Story questions' activity.",
        variant: "destructive"
      });
    }
    
    if (!hasSliderQuestions) {
      toast({
        title: "Missing slider questions",
        description: "Consider adding slider questions in the 'Slider questions' activity.",
        variant: "warning" // Changed from 'warning' to match our standardized severities
      });
    }
    
    if (!hasParticipantQuestions) {
      toast({
        title: "Missing participant questions",
        description: "Consider adding participant questions in the 'Participant questions' activity.",
        variant: "info" // Changed from 'info' to match our standardized severities
      });
    }
  };

  const showErrorToast = () => {
    toast({
      title: "Error checking form components",
      description: "Could not verify if form components exist. Please ensure you've created them.",
      variant: "destructive"
    });
  };

  return { 
    showValidationToasts,
    showErrorToast
  };
};
