
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";

interface ProjectsHeaderProps {
  isSuperUser: boolean;
  isSuperAdmin?: boolean;
  onCreateClick: () => void;
  onCreateTemplateClick?: () => void;
}

const ProjectsHeader = ({ 
  isSuperUser, 
  isSuperAdmin = false,
  onCreateClick,
  onCreateTemplateClick 
}: ProjectsHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <p className="text-gray-500">
          Create and manage your Culture Sprint projects.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          <span>New Project</span>
        </Button>

        {isSuperAdmin && onCreateTemplateClick && (
          <Button
            onClick={onCreateTemplateClick}
            variant="outline"
            className="flex items-center gap-2 border-brand-primary text-brand-primary"
          >
            <BookOpen size={16} />
            <span>New Template</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProjectsHeader;
