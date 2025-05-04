
import React from "react";
import { FormAppearance } from "../types";
import FormEditor from "./FormEditor";
import AppearancePreviewWrapper from "./AppearancePreviewWrapper";
import { FormEditorSkeleton, PreviewSkeleton } from "../FormAppearanceSkeleton";

interface FormAppearanceUIProps {
  appearance: FormAppearance;
  isLoading: boolean;
  isSaving: boolean;
  isUploading: boolean;
  projectId?: string;
  canSaveChanges?: boolean;
  onColorChange: (color: string) => void;
  onLogoChange: (url: string, file?: File) => void;
  onHeaderChange: (text: string) => void;
  onSubheaderChange: (text: string) => void;
  onSave: () => void;
  onReset: () => void;
}

const FormAppearanceUI: React.FC<FormAppearanceUIProps> = ({
  appearance,
  isLoading,
  isSaving,
  isUploading,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormEditorSkeleton />
        <PreviewSkeleton />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormEditor
        appearance={appearance}
        isLoading={isLoading}
        isSaving={isSaving}
        isUploading={isUploading}
        projectId={projectId}
        canSaveChanges={canSaveChanges}
        onColorChange={onColorChange}
        onLogoChange={onLogoChange}
        onHeaderChange={onHeaderChange}
        onSubheaderChange={onSubheaderChange}
        onSave={onSave}
        onReset={onReset}
      />
      
      <AppearancePreviewWrapper appearance={appearance} />
    </div>
  );
};

export default FormAppearanceUI;
