
import React from "react";
import { FormAppearance } from "@/components/design/form-appearance/types";
import ProjectResolutionInfo from "./debug/ProjectResolutionInfo";
import PublicAccessStatus from "./debug/PublicAccessStatus";
import PermissionsReport from "./debug/PermissionsReport";
import DebugResults from "./debug/DebugResults";
import { useFormDebug } from "./debug/useFormDebug";
import BlobUrlFixer from "./debug/components/BlobUrlFixer";

interface FormAppearanceDebugProps {
  appearance: FormAppearance;
  projectId: string | null;
  debugInfo: any;
  isResolving: boolean;
  resolutionError: string | null;
  hasBlobUrl?: boolean;
  onBlobUrlFixed?: () => void;
}

const FormAppearanceDebug: React.FC<FormAppearanceDebugProps> = ({
  appearance,
  projectId,
  debugInfo,
  isResolving,
  resolutionError,
  hasBlobUrl = false,
  onBlobUrlFixed
}) => {
  const {
    permissionsReport,
    publicAccessStatus,
    directDbData,
    isChecking,
    checkDatabaseDirectly
  } = useFormDebug({ projectId });
  
  // Don't render in production
  if (process.env.NODE_ENV === 'production') {
    return null;
  }
  
  // Create a combined debug info object that includes appearance data
  const combinedDebugInfo = debugInfo ? {
    ...debugInfo,
    appearance,
    windowLocation: window.location.pathname
  } : null;
  
  // Check if the logo URL is a blob URL
  const hasBlobUrlInAppearance = appearance?.logoUrl?.startsWith('blob:') || hasBlobUrl;
  
  return (
    <div className="bg-yellow-100 p-3 mb-4 rounded text-xs border border-yellow-300 overflow-auto max-h-[50vh]">
      <h3 className="font-bold text-sm text-yellow-800 mb-2">Form Appearance Debug Panel</h3>
      
      <div className="bg-orange-100 p-2 mb-3 border border-orange-300 rounded">
        <p className="font-bold text-orange-700">Current Route: {window.location.pathname}</p>
        <p className="text-sm text-orange-600">Form appearance is always saved to the 'build' phase regardless of current route</p>
      </div>
      
      {hasBlobUrlInAppearance && projectId && (
        <BlobUrlFixer 
          hasBlobUrls={hasBlobUrlInAppearance} 
          projectId={projectId}
          onSuccess={onBlobUrlFixed}
        />
      )}
      
      <ProjectResolutionInfo 
        projectId={projectId}
        isResolving={isResolving}
        resolutionError={resolutionError}
        appearance={appearance}
      />
      
      {/* Show public access status */}
      <PublicAccessStatus publicAccessStatus={publicAccessStatus} />
      
      {/* Show permissions report */}
      <PermissionsReport permissionsReport={permissionsReport} />
      
      {combinedDebugInfo && (
        <DebugResults 
          debugInfo={combinedDebugInfo}
          directDbData={directDbData}
          isChecking={isChecking}
          onCheckDatabase={checkDatabaseDirectly}
        />
      )}
    </div>
  );
};

export default FormAppearanceDebug;
