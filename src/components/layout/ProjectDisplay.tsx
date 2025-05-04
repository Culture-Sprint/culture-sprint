
import { cn } from "@/lib/utils";

interface ProjectDisplayProps {
  activeProject: any;
  collapsed: boolean;
}

export const ProjectDisplay = ({ activeProject, collapsed }: ProjectDisplayProps) => {
  // Don't render anything if sidebar is collapsed or no active project
  if (!activeProject || collapsed) {
    return null;
  }

  return (
    <div className="px-4 py-2 border-b border-sidebar-border/50 bg-culturesprint-600/5">
      <span className="text-xs text-sidebar-foreground/60">Current Project:</span>
      <h3 className="font-medium truncate text-brand-primary">{activeProject.name}</h3>
    </div>
  );
};
