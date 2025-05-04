
import React, { memo } from "react";
import BackgroundColorPicker from "./BackgroundColorPicker";
import LogoUploader from "./LogoUploader";
import HeaderTextEditor from "./HeaderTextEditor";
import FormActionButtons from "./FormActionButtons";
import { Skeleton } from "@/components/ui/skeleton";
import { FormAppearance } from "./types";

interface FormEditorPanelProps {
  appearance: FormAppearance;
  isLoading: boolean;
  isSaving: boolean;
  isUploading?: boolean;
  projectId?: string;
  canSaveChanges?: boolean;
  onColorChange: (color: string) => void;
  onLogoChange: (url: string, file?: File) => void;
  onHeaderChange: (text: string) => void;
  onSubheaderChange: (text: string) => void;
  onSave: () => void;
  onReset: () => void;
}

// Using memo to prevent unnecessary re-renders
const FormEditorPanel = memo<FormEditorPanelProps>(({
  appearance,
  isLoading,
  isSaving,
  isUploading = false,
  projectId,
  canSaveChanges = true,
  onColorChange,
  onLogoChange,
  onHeaderChange,
  onSubheaderChange,
  onSave,
  onReset
}) => {
  if (isLoading) {
    return (
      <div className="space-y-6 min-h-[480px]">
        <LoadingFields />
        <FormActionButtons 
          onSave={onSave}
          onReset={onReset}
          isSaving={isSaving}
          isLoading={isLoading}
          disabled={!canSaveChanges}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6 min-h-[480px]">
      <BackgroundColorPicker 
        value={appearance.backgroundColor} 
        onChange={onColorChange}
        disabled={!canSaveChanges}
      />
      
      <LogoUploader 
        logoUrl={appearance.logoUrl} 
        onLogoChange={onLogoChange} 
        projectId={projectId}
        disabled={!canSaveChanges}
      />
      
      <HeaderTextEditor 
        headerText={appearance.headerText}
        subheaderText={appearance.subheaderText}
        onHeaderChange={onHeaderChange}
        onSubheaderChange={onSubheaderChange}
        disabled={!canSaveChanges}
      />
      
      <FormActionButtons 
        onSave={onSave}
        onReset={onReset}
        isSaving={isSaving}
        isLoading={isLoading}
        isUploading={isUploading}
        disabled={!canSaveChanges}
      />
    </div>
  );
});

// Loading skeleton for form fields that appears inline rather than replacing the entire component
const LoadingFields: React.FC = () => {
  return (
    <>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>
      
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full mt-2" />
        <Skeleton className="h-4 w-48" />
      </div>
    </>
  );
};

FormEditorPanel.displayName = "FormEditorPanel";

export default FormEditorPanel;
