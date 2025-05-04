
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useProject } from "@/contexts/ProjectContext";
import FormErrorAlert from "./FormErrorAlert";
import FormAppearanceDebug from "@/components/public/FormAppearanceDebug";
import { useFormAppearanceEditor } from "./hooks/useFormAppearanceEditor";
import AuthWarning from "./components/AuthWarning";
import AppearanceEditorHeader from "./components/AppearanceEditorHeader";
import DescriptionText from "./components/DescriptionText";
import FormAppearanceUI from "./components/FormAppearanceUI";
import { useUserRole } from "@/hooks/useUserRole";

const FormAppearance: React.FC = () => {
  const { activeProject } = useProject();
  const { isSuperAdmin } = useUserRole();
  
  const {
    appearance,
    isLoading,
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
    currentRoute
  } = useFormAppearanceEditor(activeProject?.id);

  // Check if this is a template project and user is not a superadmin
  const isTemplateProject = activeProject?.is_template || activeProject?._clone;
  const isReadOnly = isTemplateProject && !isSuperAdmin();

  return (
    <Card>
      <CardHeader>
        <AppearanceEditorHeader onReload={handleReload} />
        {isReadOnly && (
          <div className="bg-blue-50 text-blue-700 rounded p-3 mt-2 text-sm">
            <p className="font-semibold">Template View Mode</p>
            <p>You can view but not modify the form appearance settings for this template project.</p>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <DescriptionText />

        <AuthWarning 
          isAuthenticated={isAuthenticated} 
          authChecked={authChecked} 
        />

        {/* Only render debug panel for superadmins */}
        {process.env.NODE_ENV !== 'production' && isSuperAdmin() && (
          <FormAppearanceDebug 
            appearance={appearance}
            projectId={activeProject?.id || null}
            debugInfo={{
              ...debugInfo,
              currentRoute,
              isTemplateProject,
              isReadOnly,
              canSaveChanges
            }}
            isResolving={isResolving}
            resolutionError={resolutionError}
            hasBlobUrl={hasBlobUrl}
            onBlobUrlFixed={handleBlobUrlFixed}
          />
        )}

        <FormErrorAlert error={appearanceError} />

        <FormAppearanceUI
          appearance={appearance}
          isLoading={isLoading}
          isSaving={isSaving}
          isUploading={isUploading}
          projectId={projectId}
          canSaveChanges={canSaveChanges}
          onColorChange={handleBackgroundColorChange}
          onLogoChange={handleLogoChange}
          onHeaderChange={handleHeaderTextChange}
          onSubheaderChange={handleSubheaderTextChange}
          onSave={handleSave}
          onReset={handleReset}
        />
      </CardContent>
    </Card>
  );
};

export default FormAppearance;
