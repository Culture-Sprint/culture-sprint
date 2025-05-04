
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle } from "lucide-react";

interface EmptyProjectStateProps {
  onCreateClick: () => void;
}

const EmptyProjectState: React.FC<EmptyProjectStateProps> = ({ onCreateClick }) => {
  return (
    <div className="text-center py-16 border border-dashed rounded-lg">
      <FileText className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
      <p className="mt-2 text-sm text-gray-500">
        Get started by creating your first project
      </p>
      <Button
        onClick={onCreateClick}
        className="mt-4 gap-2"
      >
        <PlusCircle size={16} />
        <span>Create Project</span>
      </Button>
    </div>
  );
};

export default EmptyProjectState;
