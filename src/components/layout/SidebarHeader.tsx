
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export const SidebarHeader = ({ collapsed, toggleSidebar }: SidebarHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-culturesprint-600/20">
      <Link to="/" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
        <div className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden">
          <img src="/cs_logo.png" alt="Culture Sprint Logo" className="w-full h-full object-cover" />
        </div>
        {!collapsed && (
          <span className="text-xl font-heading font-bold text-brand-primary">
            Culture Sprint
          </span>
        )}
      </Link>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-brand-primary hover:text-white hover:bg-brand-primary/90"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </Button>
    </div>
  );
};
