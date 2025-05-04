
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { uploadFormLogo } from "@/services/storage/imageUploader";
import { FormAppearance } from "../types";

/**
 * Hook to handle logo upload functionality
 */
export const useLogoUploadHandler = () => {
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (
    logoFile: File | string | null, 
    projectId: string, 
    appearance: FormAppearance
  ): Promise<{ success: boolean; updatedAppearance: FormAppearance }> => {
    if (!logoFile || !projectId) {
      return { success: false, updatedAppearance: appearance };
    }

    let finalAppearance = { ...appearance };
    let uploadSuccess = false;
    const hasBlobUrl = typeof appearance.logoUrl === 'string' && appearance.logoUrl.startsWith('blob:');

    setIsUploading(true);
    try {
      // Handle File object
      if (logoFile instanceof File) {
        console.log("Uploading logo file to Supabase storage:", logoFile.name);
        const uploadedUrl = await uploadFormLogo(logoFile, projectId);
        
        if (uploadedUrl) {
          console.log("Logo uploaded successfully, permanent URL:", uploadedUrl);
          finalAppearance = { ...finalAppearance, logoUrl: uploadedUrl };
          uploadSuccess = true;
          
          toast({
            title: "Logo uploaded",
            description: "Your logo has been uploaded successfully."
          });
        } else {
          console.error("Failed to upload logo to storage");
          toast({
            title: "Logo upload failed",
            description: "Failed to upload logo. Your other appearance settings will still be saved.",
            variant: "destructive"
          });
        }
      }
      // Handle blob URL string
      else if (typeof logoFile === 'string' && hasBlobUrl) {
        console.log("Found blob URL, trying to upload:", logoFile);
        const uploadedUrl = await uploadFormLogo(logoFile, projectId);
        
        if (uploadedUrl) {
          console.log("Blob URL uploaded successfully, permanent URL:", uploadedUrl);
          finalAppearance = { ...finalAppearance, logoUrl: uploadedUrl };
          uploadSuccess = true;
          
          toast({
            title: "Logo uploaded",
            description: "Your logo has been uploaded successfully."
          });
        } else {
          console.error("Failed to upload blob URL to storage");
          toast({
            title: "Logo upload failed", 
            description: "Failed to upload logo from blob URL. Your other appearance settings will still be saved.",
            variant: "destructive"
          });
          finalAppearance = { ...finalAppearance, logoUrl: '' };
        }
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      toast({
        title: "Logo upload error",
        description: "There was an error uploading your logo. Other settings will still be saved.",
        variant: "destructive"
      });
      finalAppearance = { ...finalAppearance, logoUrl: '' };
      uploadSuccess = false;
    } finally {
      setIsUploading(false);
    }

    // Clear unresolved blob URLs
    if (!uploadSuccess && finalAppearance.logoUrl && finalAppearance.logoUrl.startsWith('blob:')) {
      console.log("Clearing unresolved blob URL:", finalAppearance.logoUrl);
      finalAppearance = { ...finalAppearance, logoUrl: '' };
      
      toast({
        title: "Logo cleared",
        description: "The temporary logo URL has been removed as it couldn't be uploaded to permanent storage.",
        variant: "destructive"
      });
    }

    return { success: uploadSuccess, updatedAppearance: finalAppearance };
  };

  return { isUploading, handleLogoUpload };
};
