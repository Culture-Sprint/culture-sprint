
import React from "react";

interface PermissionsReportProps {
  permissionsReport: any;
}

const PermissionsReport: React.FC<PermissionsReportProps> = ({ 
  permissionsReport 
}) => {
  if (!permissionsReport) return null;
  
  return (
    <div className="mb-3">
      <p className="font-semibold text-red-800">Permissions Report:</p>
      <div className="bg-white p-2 rounded border border-red-300">
        <p>Auth Status: {permissionsReport.auth?.isAuthenticated ? 'Authenticated' : 'NOT Authenticated'}</p>
        <p>User ID: {permissionsReport.auth?.userId || 'None'}</p>
        <p>Read Access: {permissionsReport.permissions?.read?.allowed ? 'Allowed' : 'Denied'}</p>
        {permissionsReport.permissions?.read?.error && (
          <p className="text-red-600">Error: {permissionsReport.permissions.read.error}</p>
        )}
        <details>
          <summary className="cursor-pointer text-blue-600">View RLS Details</summary>
          <pre className="mt-1 bg-gray-100 p-1 overflow-auto max-h-24">
            {JSON.stringify(permissionsReport, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default PermissionsReport;
