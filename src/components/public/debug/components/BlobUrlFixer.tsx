
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { saveActivityResponse } from "@/services/supabaseSync/operations";

interface BlobUrlFixerProps {
  hasBlobUrls: boolean;
  projectId?: string;
  onSuccess?: () => void;
}

const BlobUrlFixer: React.FC<BlobUrlFixerProps> = ({
  hasBlobUrls,
  projectId,
  onSuccess
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [autoFixed, setAutoFixed] = useState(false);
  
  // Automatically fix blob URLs on component mount
  useEffect(() => {
    if (hasBlobUrls && projectId && !autoFixed) {
      console.log("Auto-fixing blob URL");
      handleFixBlobUrl();
      setAutoFixed(true);
    }
  }, [hasBlobUrls, projectId]);
  
  if (!hasBlobUrls || !projectId) {
    return null;
  }
  
  const handleFixBlobUrl = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is required to fix blob URL",
        variant: "destructive"
      });
      return;
    }
    
    setIsFixing(true);
    
    try {
      console.log("Fixing blob URL for project:", projectId);
      
      // First, get the existing appearance data to preserve other settings
      const { data: buildData } = await fetch('/api/get-form-appearance?projectId=' + projectId)
        .then(res => res.json())
        .catch(() => ({ data: null }));
        
      // If we get data, preserve all settings except the logo
      const existingData = buildData?.ar_response || {};
      const updatedData = {
        ...existingData,
        logoUrl: '',
        _updatedAt: new Date().toISOString()
      };
      
      console.log("Saving updated appearance without blob URL:", updatedData);
      
      // Update both build and design phases
      const buildSuccess = await saveActivityResponse(
        projectId,
        'build',
        'form-appearance',
        'form-appearance-editor',
        updatedData
      );
      
      const designSuccess = await saveActivityResponse(
        projectId,
        'design',
        'form-appearance',
        'form-appearance-editor',
        updatedData
      );
      
      if (buildSuccess || designSuccess) {
        toast({
          title: "Logo URL fixed",
          description: "The invalid logo URL has been removed. You can now upload a new logo."
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast({
          title: "Fix failed",
          description: "Could not fix the logo URL. Please try again or contact support.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error fixing blob URL:", error);
      toast({
        title: "Error",
        description: "An error occurred while fixing the logo URL",
        variant: "destructive"
      });
    } finally {
      setIsFixing(false);
    }
  };
  
  return (
    <div className="bg-red-50 border border-red-200 p-2 rounded mb-2">
      <p className="text-red-800 font-medium mb-2">
        Invalid logo URL detected
      </p>
      <p className="text-red-700 text-xs mb-2">
        This form has a temporary blob URL for its logo, which won't work across sessions or for other users.
      </p>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={handleFixBlobUrl}
        disabled={isFixing}
        className="text-xs h-7 px-2"
      >
        {isFixing ? "Fixing..." : "Remove Invalid URL"}
      </Button>
    </div>
  );
};

export default BlobUrlFixer;
