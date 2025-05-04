
import { StoryData } from './types';
import { useToast } from "@/components/ui/use-toast";

export const useFormValidation = () => {
  const { toast } = useToast();

  const validateFormData = (formData: StoryData, isPublic = false): boolean => {
    console.log("VALIDATION START - Validating form data for " + (isPublic ? "public" : "authenticated") + " submission:", formData);
    
    // For all submissions, either story text or audio is required
    const hasText = formData.text && formData.text.trim() !== '';
    const hasAudio = formData.hasAudio === true;
    
    console.log("VALIDATION CHECK - Has text:", hasText, "Has audio:", hasAudio, "hasAudio type:", typeof formData.hasAudio);
    
    if (!hasText && !hasAudio) {
      console.log("VALIDATION FAILED - Missing both story text and audio");
      toast({
        title: "Missing story",
        description: "Please share your story either by writing or recording it.",
        variant: "destructive" // Using our standardized error severity
      });
      return false;
    }

    if (!formData.title?.trim()) {
      toast({
        title: "Missing title",
        description: "Please add a title to your story.",
        variant: "destructive"
      });
      return false;
    }

    // For public submissions, we have simpler validation and are more forgiving
    if (isPublic) {
      console.log("VALIDATION SUCCESS - Public submission, simplified validation passed");
      // No additional validation for public submissions
      return true;
    }
    
    console.log("VALIDATION SUCCESS - Authenticated submission, full validation passed");
    
    return true;
  };

  return { validateFormData };
};
