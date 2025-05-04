
import React from "react";

interface SidebarRoleIndicatorProps {
  isSuperUser: boolean;
  isDemo: boolean;
}

export const SidebarRoleIndicator: React.FC<SidebarRoleIndicatorProps> = ({ 
  isSuperUser, 
  isDemo 
}) => {
  if (!isSuperUser && !isDemo) return null;
  
  return (
    <>
      {isSuperUser && (
        <div 
          className="absolute top-0 right-0 w-2 h-2 bg-brand-secondary rounded-full m-2" 
          title="Superuser Access"
        />
      )}
      {isDemo && (
        <div 
          className="absolute top-0 right-0 w-2 h-2 bg-amber-500 rounded-full m-2" 
          title="Demo User"
        />
      )}
    </>
  );
};
