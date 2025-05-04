
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProject } from "@/contexts/ProjectContext";
import { createOrUpdateFormIdentifier, fetchExistingFormIdentifier } from "./form-save/formIdentifiers";
import { 
  saveStoryQuestion, 
  saveSliderQuestions, 
  saveParticipantQuestions, 
  saveLegacyFormConfig 
} from "./form-save/formDataSave";
import { PublicLinkData } from "./form-save/types";
import { getPublicFormBaseUrl } from "@/utils/urlUtils";

export const useFormSave = (
  storyQuestion: string,
  sliderQuestions: any[],
  participantQuestions: any[]
) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [publicLink, setPublicLink] = useState<string | null>(null);
  const { activeProject } = useProject();

  const handleSaveFormConfiguration = async () => {
    if (!activeProject?.id) {
      toast({
        title: "No active project",
        description: "Please select or create a project first.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log("Saving form configuration with the following data:");
      console.log("- Project ID:", activeProject.id);
      console.log("- Story Question:", storyQuestion);
      console.log("- Slider Questions:", sliderQuestions.length, "questions");
      console.log("- Participant Questions:", participantQuestions.length, "questions");
      
      // Save individual components directly
      const storyPromise = saveStoryQuestion(activeProject.id, storyQuestion);
      const sliderPromise = saveSliderQuestions(activeProject.id, sliderQuestions);
      const participantPromise = saveParticipantQuestions(activeProject.id, participantQuestions);
      const legacyPromise = saveLegacyFormConfig(
        activeProject.id, 
        storyQuestion, 
        sliderQuestions, 
        participantQuestions
      );
      
      // Wait for all saves to complete
      const [storyResult, sliderResult, participantResult, legacyResult] = 
        await Promise.all([storyPromise, sliderPromise, participantPromise, legacyPromise]);
      
      if (storyResult && sliderResult && participantResult && legacyResult) {
        // Create or get a form identifier for this project
        const formId = await createOrUpdateFormIdentifier(activeProject.id);
        
        if (formId) {
          // Generate the public link with form ID
          const baseUrl = getPublicFormBaseUrl();
          const publicFormLink = `${baseUrl}/submit-story/${formId}`;
          setPublicLink(publicFormLink);
          
          toast({
            title: "Form configuration saved",
            description: "Your form is now available via the public link for anonymous users to submit stories.",
          });
          
          // After saving, show the copy link toast to encourage sharing
          setTimeout(() => {
            toast({
              title: "Ready to share",
              description: "Copy the link to share with participants. The form is identical to what you see here.",
            });
          }, 1000);
        } else {
          toast({
            title: "Form saved but link creation failed",
            description: "Your form was saved but we couldn't create a shareable link. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Partial success",
          description: "Some components of your form might not have been saved. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving form configuration:", error);
      toast({
        title: "Error saving form",
        description: error instanceof Error ? error.message : "There was a problem saving your form configuration. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    publicLink,
    handleSaveFormConfiguration
  };
};
