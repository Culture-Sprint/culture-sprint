
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { uploadFormLogo } from "@/services/storage/imageUploader";

interface UseLogoUploaderProps {
  logoUrl: string;
  projectId?: string;
  onLogoChange: (url: string, file?: File) => void;
}

export const useLogoUploader = ({
  logoUrl,
  projectId,
  onLogoChange
}: UseLogoUploaderProps) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidLogoUrl, setIsValidLogoUrl] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data?.user);
    };
    
    checkAuth();
  }, []);
  
  // Validate logo URL
  useEffect(() => {
    // Skip validation for empty URL
    if (!logoUrl) {
      setIsValidLogoUrl(true);
      return;
    }
    
    // For blob URLs, we know they won't work across sessions
    if (logoUrl.startsWith('blob:')) {
      console.warn("Blob URL detected - this won't persist across sessions:", logoUrl);
      // We still set it to true for display, but we know it's temporary
      setIsValidLogoUrl(true);
      return;
    }
    
    // For regular URLs, verify they load properly
    const img = new Image();
    img.onload = () => setIsValidLogoUrl(true);
    img.onerror = () => {
      console.warn("Logo URL failed to load:", logoUrl);
      setIsValidLogoUrl(false);
    };
    img.src = logoUrl;
  }, [logoUrl]);

  const handleFileUpload = async (file: File | null) => {
    setUploadError(null);
    
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload an image file.');
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setUploadError('Image size should be less than 1MB.');
      toast({
        title: "File too large",
        description: "Image size should be less than 1MB",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a temporary URL for the uploaded file for preview
      const tempUrl = URL.createObjectURL(file);
      
      // If authenticated and we have a project ID, upload immediately
      if (isAuthenticated && projectId) {
        setIsUploading(true);
        try {
          toast({
            title: "Uploading logo",
            description: "Please wait while your logo is being uploaded...",
          });
          
          // Upload the file directly to storage
          const permanentUrl = await uploadFormLogo(file, projectId);
          
          if (permanentUrl) {
            // Use the permanent URL
            onLogoChange(permanentUrl);
            
            toast({
              title: "Logo uploaded",
              description: "Your logo has been uploaded and will be visible to everyone.",
              duration: 3000
            });
          } else {
            // Fall back to temp URL if upload fails
            onLogoChange(tempUrl, file);
            
            toast({
              title: "Upload to storage failed",
              description: "Using temporary preview. Your logo will be uploaded when you save the form.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Error uploading logo:", error);
          // Fall back to temp URL
          onLogoChange(tempUrl, file);
          
          toast({
            title: "Upload error",
            description: "There was a problem uploading your logo. It will be saved when you save the form.",
            variant: "destructive"
          });
        } finally {
          setIsUploading(false);
        }
      } else {
        // Just pass the temp URL and file for later upload
        onLogoChange(tempUrl, file);
        
        if (!isAuthenticated) {
          toast({
            title: "Preview mode",
            description: "You're seeing a preview of your logo. Sign in to save it permanently.",
            duration: 5000
          });
        } else {
          toast({
            title: "Logo selected",
            description: "Your logo will be uploaded when you save the form appearance",
            duration: 3000
          });
        }
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setUploadError('Error processing file. Please try again.');
      toast({
        title: "Error processing file",
        description: "There was a problem processing your image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    uploadError,
    isAuthenticated,
    isValidLogoUrl,
    isUploading,
    handleFileUpload
  };
};
