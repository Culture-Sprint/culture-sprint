
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuthCheck } from "./useAuthCheck";
import { useAppearanceState } from "./useAppearanceState";
import { useLogoUploadHandler } from "./useLogoUploadHandler";
import { useSaveAppearance } from "./useSaveAppearance";
import { useProjectResolution } from "./useProjectResolution";
import { useFormAppearanceLoader } from "./useFormAppearanceLoader";
import { useTemplateStatus } from "./useTemplateStatus";
import { FormAppearance } from "../types";

export const useFormAppearanceEditor = (projectId?: string) => {
  const location = useLocation();
  const { isSuperAdmin } = useUserRole();
  
  // Load appearance data and handle template status checks
  const { 
    appearance: loadedAppearance, 
    isLoading: isAppearanceLoading, 
    error: appearanceError,
    hasBlobUrl,
    reloadAppearance,
    isEditing
  } = useFormAppearanceLoader(projectId, true);
  
  // Check template status - can we save changes?
  const { canSaveChanges } = useTemplateStatus(projectId, isSuperAdmin());
  
  // Authentication check
  const { isAuthenticated, authChecked } = useAuthCheck();
  
  // Project resolution and debug info
  const { isResolving, resolutionError, debugInfo } = useProjectResolution(projectId, isAuthenticated);
  
  // Appearance state management
  const {
    appearance,
    pendingLogoFile,
    setPendingLogoFile,
    setAppearance,
    handleBackgroundColorChange,
    handleLogoChange,
    handleHeaderTextChange,
    handleSubheaderTextChange
  } = useAppearanceState(loadedAppearance);
  
  // Logo upload functionality
  const { isUploading, handleLogoUpload } = useLogoUploadHandler();
  
  // Save functionality
  const { isSaving, saveAppearance } = useSaveAppearance();
  
  const handleSave = async () => {
    if (!projectId) {
      toast({
        title: "No project selected",
        description: "Please select a project before saving form appearance",
        variant: "destructive"
      });
      return;
    }
    
    if (!canSaveChanges) {
      toast({
        title: "Cannot modify template",
        description: "You don't have permission to modify appearance settings in template projects.",
        variant: "destructive"
      });
      return;
    }
    
    if (pendingLogoFile && !isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "You need to be logged in to upload logo images.",
        variant: "destructive"
      });
      return;
    }
    
    // Mark that we're editing to prevent reload conflicts
    isEditing.current = true;

    let finalAppearance: FormAppearance = { ...appearance };
    
    // Handle logo upload first if needed
    if ((pendingLogoFile || hasBlobUrl) && projectId && isAuthenticated) {
      const logoSource = pendingLogoFile || (hasBlobUrl ? appearance.logoUrl : null);
      const { updatedAppearance } = await handleLogoUpload(logoSource, projectId, appearance);
      finalAppearance = updatedAppearance;
      
      if (pendingLogoFile) {
        setPendingLogoFile(null);
      }
    }

    // Save the appearance data
    const success = await saveAppearance(projectId, finalAppearance, location.pathname);
    
    if (success) {
      // Set a slight delay before reloading to ensure DB transaction is complete
      setTimeout(async () => {
        isEditing.current = false;
        await reloadAppearance();
      }, 1000);
    } else {
      isEditing.current = false;
    }
  };

  const handleReset = () => {
    if (!canSaveChanges) {
      toast({
        title: "Cannot modify template",
        description: "You don't have permission to modify appearance settings in template projects.",
        variant: "destructive"
      });
      return;
    }
    
    // Reset to default appearance
    const defaultAppearance = {
      backgroundColor: "#f9fafb",
      logoUrl: "",
      headerText: "Share Your Story",
      subheaderText: "Help us understand your experience by sharing your story below."
    };
    
    setAppearance(defaultAppearance);
    setPendingLogoFile(null);
    
    toast({
      title: "Reset to defaults",
      description: "Form appearance has been reset to default settings. Click Save to apply changes."
    });
  };

  const handleReload = async () => {
    toast({
      title: "Reloading appearance settings",
      description: "Please wait..."
    });
    
    // Reset the editing state before reloading
    isEditing.current = false;
    setPendingLogoFile(null);
    
    await reloadAppearance();
    
    toast({
      title: "Appearance reloaded",
      description: "Form appearance settings have been refreshed from 'build' phase."
    });
  };

  const handleBlobUrlFixed = () => {
    reloadAppearance();
  };

  return {
    appearance,
    isLoading: isAppearanceLoading,
    isSaving,
    isUploading,
    isAuthenticated,
    authChecked,
    debugInfo,
    isResolving,
    resolutionError,
    hasBlobUrl,
    appearanceError,
    canSaveChanges,
    handleSave,
    handleReset,
    handleBackgroundColorChange,
    handleLogoChange,
    handleHeaderTextChange,
    handleSubheaderTextChange,
    handleReload,
    handleBlobUrlFixed,
    projectId,
    currentRoute: location.pathname
  };
};
