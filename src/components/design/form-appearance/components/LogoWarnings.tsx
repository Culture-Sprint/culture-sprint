
import React from "react";

interface LogoWarningsProps {
  isValidLogoUrl: boolean;
  logoUrl: string;
  isBlobUrl: boolean;
}

const LogoWarnings: React.FC<LogoWarningsProps> = ({
  isValidLogoUrl,
  logoUrl,
  isBlobUrl
}) => {
  return (
    <>
      {(!isValidLogoUrl && logoUrl) && (
        <div className="text-amber-600 text-xs p-2 bg-amber-50 border border-amber-200 rounded">
          The logo URL is not valid in this session. Please upload a new logo.
        </div>
      )}
      
      {isBlobUrl && (
        <div className="text-amber-600 text-xs p-2 bg-amber-50 border border-amber-200 rounded">
          <p className="font-medium">Temporary preview only</p>
          <p>This logo is using a temporary URL that won't be visible to others. 
          Save the form to upload it permanently.</p>
        </div>
      )}
    </>
  );
};

export default LogoWarnings;
