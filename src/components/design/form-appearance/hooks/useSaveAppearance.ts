
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { FormAppearance } from "../types";
import { saveActivityResponse } from "@/services/supabaseSync/operations/save/saveActivityResponse";

/**
 * Hook to handle saving form appearance data
 */
export const useSaveAppearance = () => {
  const [isSaving, setIsSaving] = useState(false);

  const saveAppearance = async (
    projectId: string | undefined, 
    dataToSave: FormAppearance, 
    sourcePath: string
  ): Promise<boolean> => {
    if (!projectId) {
      console.error("Cannot save without project ID");
      return false;
    }
    
    console.log(`[saveAppearance] Saving appearance data to build phase from route ${sourcePath}:`, dataToSave);
    setIsSaving(true);
    
    try {
      // Always ensure we're using the 'build' phase for form appearance data
      const success = await saveActivityResponse(
        projectId,
        'build', // Always use 'build' phase
        'form-appearance',
        'form-appearance-editor',
        {
          ...dataToSave,
          _updatedAt: new Date().toISOString(),
          _savedFrom: sourcePath
        }
      );
      
      if (success) {
        console.log("[saveAppearance] Save successful");
        toast({
          title: "Appearance saved",
          description: "Your form appearance settings have been saved successfully."
        });
      } else {
        console.error("[saveAppearance] Save failed");
        toast({
          title: "Save failed",
          description: "Failed to save appearance. Please try again.",
          variant: "destructive"
        });
      }
      
      return success;
    } catch (error) {
      console.error("[saveAppearance] Error saving appearance:", error);
      toast({
        title: "Save failed",
        description: "An error occurred while saving appearance settings.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, saveAppearance };
};
