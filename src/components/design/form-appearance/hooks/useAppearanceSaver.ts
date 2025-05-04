
import { uploadFormLogo } from "@/services/storage/imageUploader";
import { toast } from "@/components/ui/use-toast";
import { FormAppearance } from "../types";

interface UseAppearanceSaverProps {
  projectId?: string;
  setIsSaving: (isSaving: boolean) => void;
  appearance: FormAppearance;
  saveActivityResponse: (projectId: string, phaseId: string, stepId: string, activityId: string, data: any) => Promise<boolean>;
  isEditing: React.MutableRefObject<boolean>;
}

export const useAppearanceSaver = ({
  projectId,
  setIsSaving,
  appearance,
  saveActivityResponse,
  isEditing
}: UseAppearanceSaverProps) => {
  
  const saveAppearance = async (appearanceToSave?: FormAppearance): Promise<boolean> => {
    if (!projectId) {
      console.error("Cannot save appearance without a project ID");
      toast({
        title: "Save error",
        description: "Cannot save appearance without a project ID",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setIsSaving(true);
      console.log("Starting save of form appearance for project:", projectId);
      
      // Use the provided appearance or the default one from props
      const dataToSave = appearanceToSave || appearance;
      console.log("Current appearance data to save:", dataToSave);
      
      // Check if logoUrl is a blob URL that needs to be uploaded to permanent storage
      let finalLogoUrl = dataToSave.logoUrl;
      
      if (dataToSave.logoUrl && dataToSave.logoUrl.startsWith('blob:')) {
        console.log("Detected blob URL, uploading to permanent storage:", dataToSave.logoUrl);
        
        try {
          // Upload the blob URL to permanent storage
          const permanentUrl = await uploadFormLogo(dataToSave.logoUrl, projectId);
          
          if (permanentUrl) {
            console.log("Logo uploaded to permanent storage:", permanentUrl);
            finalLogoUrl = permanentUrl;
            
            toast({
              title: "Logo uploaded",
              description: "Your logo has been uploaded to permanent storage."
            });
          } else {
            console.error("Failed to upload logo to permanent storage");
            toast({
              title: "Logo upload failed",
              description: "Failed to upload logo to permanent storage. Using empty logo URL for consistency.",
              variant: "destructive"
            });
            finalLogoUrl = '';
          }
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast({
            title: "Logo upload error",
            description: "There was an error uploading your logo. Using empty logo URL for consistency.",
            variant: "destructive"
          });
          finalLogoUrl = '';
        }
      }
      
      // Preserve all existing appearance settings, just update the logo if necessary
      const saveData = {
        ...dataToSave,
        logoUrl: finalLogoUrl,
        _updatedAt: new Date().toISOString()
      };
      
      console.log("Saving form appearance data to 'build' phase:", saveData);
      
      // CRITICAL: Always use the 'build' phase for consistent data storage of form appearance
      const phaseId = 'build';
      const success = await saveActivityResponse(
        projectId,
        phaseId,
        'form-appearance',
        'form-appearance-editor',
        saveData
      );
      
      if (success) {
        toast({
          title: "Appearance saved",
          description: "Your form appearance settings have been saved successfully to the 'build' phase."
        });
      } else {
        toast({
          title: "Save failed",
          description: "Failed to save appearance. Please try again.",
          variant: "destructive"
        });
      }
      
      // Mark that we're not editing anymore
      isEditing.current = false;
      
      return success;
    } catch (error) {
      console.error("Error saving appearance:", error);
      toast({
        title: "Save error",
        description: "An unexpected error occurred while saving appearance settings.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  return { saveAppearance };
};
