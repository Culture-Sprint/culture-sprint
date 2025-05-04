
import { useState, useCallback, useEffect } from "react";
import { FormAppearance } from "../types";
import { defaultAppearance } from "../types";

export const useAppearanceState = (initialAppearance: FormAppearance | null) => {
  const [appearance, setAppearance] = useState<FormAppearance>({...defaultAppearance});
  const [pendingLogoFile, setPendingLogoFile] = useState<File | null>(null);

  // Update state when loaded appearance changes
  useEffect(() => {
    if (initialAppearance) {
      setAppearance(initialAppearance);
    }
  }, [initialAppearance]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleBackgroundColorChange = useCallback((color: string) => {
    setAppearance(prev => ({ ...prev, backgroundColor: color }));
  }, []);

  const handleLogoChange = useCallback((url: string, file?: File) => {
    setAppearance(prev => ({ ...prev, logoUrl: url }));
    if (file) {
      setPendingLogoFile(file);
    }
  }, []);

  const handleHeaderTextChange = useCallback((text: string) => {
    setAppearance(prev => ({ ...prev, headerText: text }));
  }, []);

  const handleSubheaderTextChange = useCallback((text: string) => {
    setAppearance(prev => ({ ...prev, subheaderText: text }));
  }, []);

  return {
    appearance,
    setAppearance,
    pendingLogoFile,
    setPendingLogoFile,
    handleBackgroundColorChange,
    handleLogoChange,
    handleHeaderTextChange,
    handleSubheaderTextChange
  };
};
