
import React from "react";

interface DebugDataDisplayProps {
  debugInfo: any;
  directDbData: any;
}

const DebugDataDisplay: React.FC<DebugDataDisplayProps> = ({
  debugInfo,
  directDbData
}) => {
  return (
    <>
      <details>
        <summary className="cursor-pointer font-medium">Debug Info</summary>
        <pre className="mt-1 bg-gray-100 p-1 overflow-auto max-h-40">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>
      
      {directDbData && (
        <details className="mt-1">
          <summary className="cursor-pointer font-medium">Direct Database Results</summary>
          <pre className="mt-1 bg-gray-100 p-1 overflow-auto max-h-40">
            {JSON.stringify(directDbData, null, 2)}
          </pre>
        </details>
      )}
    </>
  );
};

export default DebugDataDisplay;
