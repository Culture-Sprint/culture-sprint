
import React from "react";
import BlobUrlFixer from "./components/BlobUrlFixer";
import DebugDataDisplay from "./components/DebugDataDisplay";
import CheckDatabaseButton from "./components/CheckDatabaseButton";

interface DebugResultsProps {
  debugInfo: any;
  directDbData: any;
  isChecking: boolean;
  onCheckDatabase: () => Promise<void>;
}

const DebugResults: React.FC<DebugResultsProps> = ({
  debugInfo,
  directDbData,
  isChecking,
  onCheckDatabase
}) => {
  if (!debugInfo) return null;
  
  // Detect blob URLs in the appearance data - check both directly in debugInfo.appearance and in response
  const hasBlobUrls = (debugInfo?.appearance?.logoUrl?.startsWith('blob:') || 
                      debugInfo?.response?.logoUrl?.startsWith('blob:'));
  
  // Get the actual blob URL from wherever it exists
  const blobUrl = hasBlobUrls ? 
    (debugInfo.appearance?.logoUrl?.startsWith('blob:') ? 
      debugInfo.appearance.logoUrl : 
      debugInfo.response?.logoUrl) : 
    null;
  
  console.log("Debug info:", debugInfo);
  console.log("Blob URL detection:", { hasBlobUrls, blobUrl });

  const handleSuccess = () => {
    console.log("Blob URL fix was successful");
    // Could trigger any additional logic needed after fixing the URL
  };
  
  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-blue-800">Debug Results:</p>
        <CheckDatabaseButton 
          onCheckDatabase={onCheckDatabase}
          isChecking={isChecking}
        />
      </div>
      
      <div className="bg-white p-2 rounded border border-blue-300 text-xs">
        <BlobUrlFixer 
          hasBlobUrls={hasBlobUrls}
          projectId={debugInfo?.query?.projectId}
          onSuccess={handleSuccess}
        />
        
        <DebugDataDisplay 
          debugInfo={debugInfo}
          directDbData={directDbData}
        />
      </div>
    </div>
  );
};

export default DebugResults;
