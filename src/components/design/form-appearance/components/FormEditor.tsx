
import React from "react";
import { FormAppearance } from "../types";
import FormEditorPanel from "../FormEditorPanel";

interface FormEditorProps {
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

const FormEditor: React.FC<FormEditorProps> = ({
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
  return (
    <div className="relative">
      {!canSaveChanges && (
        <div className="absolute top-0 right-0 z-10 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-md text-sm mb-4 shadow-sm">
          <p className="font-medium">View-only mode</p>
          <p className="text-xs">Template settings are read-only</p>
        </div>
      )}
      
      <FormEditorPanel
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
    </div>
  );
};

export default FormEditor;
