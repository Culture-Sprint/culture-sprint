
import React from "react";

interface AuthWarningProps {
  isAuthenticated: boolean;
  authChecked: boolean;
}

const AuthWarning: React.FC<AuthWarningProps> = ({
  isAuthenticated,
  authChecked
}) => {
  if (isAuthenticated || !authChecked) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 p-3 rounded text-amber-800 text-sm">
      <p className="font-medium">Note:</p>
      <p>You're not currently logged in. You can preview logos, but to permanently upload and save them, please log in first.</p>
    </div>
  );
};

export default AuthWarning;
