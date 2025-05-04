
import React from "react";

interface ProjectResolutionInfoProps {
  projectId: string | null;
  isResolving: boolean;
  resolutionError: string | null;
  appearance: {
    backgroundColor: string;
    logoUrl: string;
    headerText: string;
    subheaderText: string;
  };
}

const ProjectResolutionInfo: React.FC<ProjectResolutionInfoProps> = ({
  projectId,
  isResolving,
  resolutionError,
  appearance,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 mb-2">
      <div>
        <p className="font-semibold">Project Resolution:</p>
        <p>Project ID: {projectId || 'Not resolved yet'}</p>
        <p>Still Resolving: {isResolving ? 'Yes' : 'No'}</p>
        <p>Resolution Error: {resolutionError || 'None'}</p>
        <p className="font-bold text-orange-600">Current Route: {window.location.pathname}</p>
      </div>
      
      <div>
        <p className="font-semibold">Current Appearance Settings:</p>
        <p>Background: {appearance.backgroundColor}</p>
        <p>Logo URL: {appearance.logoUrl ? (appearance.logoUrl.substring(0, 30) + '...') : 'None'}</p>
        <p>Header: {appearance.headerText}</p>
        <p>Subheader: {appearance.subheaderText}</p>
      </div>
    </div>
  );
};

export default ProjectResolutionInfo;
