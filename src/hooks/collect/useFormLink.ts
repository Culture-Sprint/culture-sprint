
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useProject } from "@/contexts/ProjectContext";
import { getPublicFormBaseUrl } from "@/utils/urlUtils";
import { 
  fetchExistingFormIdentifier, 
  createOrUpdateFormIdentifier, 
  revokeFormIdentifier 
} from "./form-save/formIdentifiers";

export const useFormLink = () => {
  const [copied, setCopied] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const { toast } = useToast();
  const { activeProject } = useProject();

  // Fetch the form ID when the active project changes
  useEffect(() => {
    const getFormId = async () => {
      if (activeProject?.id) {
        const existingFormId = await fetchExistingFormIdentifier(activeProject.id);
        console.log("useFormLink - Fetched existing form ID:", existingFormId, "for project:", activeProject.id);
        setFormId(existingFormId);
      }
    };
    
    getFormId();
  }, [activeProject?.id]);

  const ensureFormIdExists = useCallback(async () => {
    if (!activeProject?.id) return null;
    
    // If we already have a form ID, use it
    if (formId) return formId;
    
    // Otherwise, create a new form ID
    setIsGenerating(true);
    try {
      console.log("useFormLink - Creating new form ID for project:", activeProject.id);
      const newFormId = await createOrUpdateFormIdentifier(activeProject.id);
      console.log("useFormLink - Created new form ID:", newFormId);
      setFormId(newFormId);
      return newFormId;
    } catch (error) {
      console.error("Error generating form ID:", error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [activeProject?.id, formId]);

  const getPublicLink = useCallback(async () => {
    if (!activeProject?.id) {
      console.log("No project ID available for public link");
      return null;
    }
    
    // Ensure we have a form ID
    const linkFormId = formId || await ensureFormIdExists();
    
    if (!linkFormId) {
      console.error("Failed to get or create form ID");
      return null;
    }
    
    // Generate the public link with the form ID
    console.log("Generating public link with form ID:", linkFormId);
    return `${getPublicFormBaseUrl()}/submit-story/${linkFormId}`;
  }, [activeProject?.id, formId, ensureFormIdExists]);
  
  const handleCopyLink = useCallback(async () => {
    const publicLink = await getPublicLink();
    if (!publicLink) {
      toast({
        title: "Error",
        description: "Could not generate public link. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Copying public link to clipboard:", publicLink);
    navigator.clipboard.writeText(publicLink);
    setCopied(true);
    toast({
      title: "Link copied",
      description: "The public submission link has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  }, [getPublicLink, toast]);
  
  const handleOpenInNewTab = useCallback(async () => {
    const publicLink = await getPublicLink();
    if (!publicLink) {
      toast({
        title: "Error",
        description: "Could not generate public link. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    console.log("Opening public link in new tab:", publicLink);
    window.open(publicLink, '_blank');
  }, [getPublicLink, toast]);

  const handleRevokeLink = useCallback(async () => {
    if (!activeProject?.id) {
      toast({
        title: "Error",
        description: "No active project selected.",
        variant: "destructive"
      });
      return;
    }

    setIsRevoking(true);
    try {
      console.log("useFormLink - Revoking form link for project:", activeProject.id);
      const success = await revokeFormIdentifier(activeProject.id);
      if (success) {
        console.log("useFormLink - Successfully revoked form link");
        setFormId(null);
        toast({
          title: "Link revoked",
          description: "The public submission link has been revoked and is no longer accessible.",
        });
      } else {
        console.error("useFormLink - Failed to revoke form link");
        toast({
          title: "Error",
          description: "Failed to revoke the public link. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error revoking form link:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while revoking the link.",
        variant: "destructive"
      });
    } finally {
      setIsRevoking(false);
    }
  }, [activeProject?.id, toast]);

  return {
    copied,
    formId,
    isGenerating,
    isRevoking,
    handleCopyLink,
    handleOpenInNewTab,
    handleRevokeLink,
    ensureFormIdExists
  };
};
