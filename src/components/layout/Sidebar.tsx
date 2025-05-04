
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { cn } from "@/lib/utils";
import { useUserRole } from "@/hooks/useUserRole";
import { getStorageItem, setStorageItem } from "@/services/utils/storageUtils";
import { SidebarHeader } from "./SidebarHeader";
import { ProjectDisplay } from "./ProjectDisplay";
import { SidebarNavigation } from "./SidebarNavigation";
import { SidebarUserSection } from "./sidebar/SidebarUserSection";
import { SidebarRoleIndicator } from "./sidebar/SidebarRoleIndicator";

const SIDEBAR_STATE_KEY = "culturesprint_sidebar_state";

const Sidebar = () => {
  const { user } = useAuth();
  const { isSuperUser, isDemo } = useUserRole();
  const { activeProject } = useProject();
  
  // Initialize collapsed state from localStorage
  const [collapsed, setCollapsed] = useState(() => {
    return getStorageItem<boolean>(SIDEBAR_STATE_KEY, false);
  });

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    // Persist the sidebar state in localStorage
    setStorageItem(SIDEBAR_STATE_KEY, newState);
  };

  return (
    <aside className={cn(
      "bg-culturesprint-600/10 text-sidebar-foreground border-r border-sidebar-border flex flex-col h-screen transition-all duration-300 relative",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Role indicators */}
      <SidebarRoleIndicator isSuperUser={isSuperUser()} isDemo={isDemo} />
      
      {/* Header */}
      <SidebarHeader collapsed={collapsed} toggleSidebar={toggleSidebar} />
      
      {/* Project display */}
      <ProjectDisplay activeProject={activeProject} collapsed={collapsed} />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 bg-culturesprint-600/5 flex flex-col">
        <SidebarNavigation 
          collapsed={collapsed} 
          activeProject={activeProject} 
          user={user} 
        />
      </div>

      {/* User section */}
      <SidebarUserSection collapsed={collapsed} />
    </aside>
  );
};

export default Sidebar;
