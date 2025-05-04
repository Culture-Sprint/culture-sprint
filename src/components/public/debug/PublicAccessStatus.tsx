
import React from "react";

interface PublicAccessStatusProps {
  publicAccessStatus: boolean | null;
}

const PublicAccessStatus: React.FC<PublicAccessStatusProps> = ({ 
  publicAccessStatus 
}) => {
  return (
    <div className="mb-3">
      <p className="font-semibold text-blue-800">Public Access Status:</p>
      <div className={`p-2 rounded border ${publicAccessStatus === true ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
        <p>Public Form Access: {publicAccessStatus === null ? 'Checking...' : (publicAccessStatus ? 'Enabled ✓' : 'Disabled ✗')}</p>
        <p className="text-sm">
          {publicAccessStatus 
            ? "This project has a valid form ID and should be accessible without authentication." 
            : "This project does not have a valid public form ID or RLS is not properly configured."}
        </p>
      </div>
    </div>
  );
};

export default PublicAccessStatus;
