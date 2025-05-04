
import React, { memo } from "react";
import { Project } from "@/types/project";
import ProjectList from "./ProjectList";
import EmptyProjectState from "./EmptyProjectState";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsContentProps {
  projects: Project[];
  loading: boolean;
  projectOwners: Record<string, string>;
  onCreateClick: () => void;
  onOpenProject: (project: Project) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
  isTemplateOrClone?: (project: Project) => boolean;
}

// Using memo to prevent unnecessary re-renders
const ProjectsContent: React.FC<ProjectsContentProps> = memo(({
  projects,
  loading,
  projectOwners,
  onCreateClick,
  onOpenProject,
  onEditProject,
  onDeleteProject,
  isTemplateOrClone
}) => {
  // Always show loading state on initial load
  if (loading && projects.length === 0) {
    return <ProjectsLoadingSkeleton />;
  }

  // Check if there are actually any projects to display
  if (!projects || projects.length === 0) {
    return <EmptyProjectState onCreateClick={onCreateClick} />;
  }

  return (
    <ProjectList
      projects={projects}
      onOpen={onOpenProject}
      onEdit={onEditProject}
      onDelete={onDeleteProject}
      projectOwners={projectOwners}
      isTemplateOrClone={isTemplateOrClone}
    />
  );
});

ProjectsContent.displayName = 'ProjectsContent';

const ProjectsLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="border rounded-lg overflow-hidden">
          <div className="p-6 pb-3">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="px-6 py-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="px-6 py-4 flex justify-between border-t bg-muted/50">
            <Skeleton className="h-9 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9" />
              <Skeleton className="h-9 w-9" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsContent;
