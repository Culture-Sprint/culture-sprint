
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  FolderKanban,
  Paintbrush,  // Changed icon for Design
  Search,
  BarChart2,
  MessageCircle,
  Info,
  Shield,
  Minus,
  MessageSquare,
  Package  // Added for Collect section
} from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface NavigationItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface SidebarNavigationProps {
  collapsed: boolean;
  activeProject: any;
  user: any | null;
}

export const SidebarNavigation = ({ collapsed, activeProject, user }: SidebarNavigationProps) => {
  const location = useLocation();
  const { isSuperUser, isAdmin } = useUserRole();

  // Function to trigger Gist chatbot
  const triggerGistChat = () => {
    if (typeof window !== 'undefined' && window.gist && typeof window.gist.trigger === 'function') {
      window.gist.trigger('bot', 8008);
    }
  };

  // Base navigation items always shown (with About moved out)
  const baseNavigation = [
    ...(user ? [{ name: "Projects", href: "/projects", icon: <FolderKanban size={collapsed ? 24 : 20} /> }] : []),
    { name: "AI Assistant", href: "/chat", icon: <MessageCircle size={collapsed ? 24 : 20} /> },
  ];

  // Project-specific navigation items only shown when a project is active
  const projectNavigation = activeProject 
    ? [
        { name: "Design", href: "/design", icon: <Paintbrush size={collapsed ? 24 : 20} /> },
        { name: "Collect", href: "/collect", icon: <Package size={collapsed ? 24 : 20} /> },
        { name: "Explore", href: "/explore", icon: <Search size={collapsed ? 24 : 20} /> },
        { name: "Dashboard", href: "/dashboard", icon: <BarChart2 size={collapsed ? 24 : 20} /> },
      ] 
    : [];

  // About/Information and Contact sections
  // For authenticated users, show "Information" instead of "About"
  const informationNavigation = [
    user 
      ? { name: "Information", href: "/information", icon: <Info size={collapsed ? 24 : 20} /> }
      : { name: "About", href: "/about", icon: <Info size={collapsed ? 24 : 20} /> },
    { name: "Contact Us", onClick: triggerGistChat, icon: <MessageSquare size={collapsed ? 24 : 20} /> }
  ];

  // Combine regular navigation items
  const navigation = [...baseNavigation, ...projectNavigation];

  // Admin navigation - kept separate to be placed at the bottom
  const adminNavigation = isSuperUser() ? [
    { name: "Admin", href: "/admin", icon: <Shield size={collapsed ? 24 : 20} /> }
  ] : [];

  // Render navigation item with conditional tooltip
  const renderNavItem = (item: NavigationItem) => {
    const isClickable = !!item.onClick;
    
    const navContent = (
      <div
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium",
          collapsed && "justify-center p-2",
          location.pathname === item.href
            ? "bg-brand-primary text-white"
            : "text-sidebar-foreground hover:bg-brand-primary/10 hover:text-brand-primary",
          isClickable && "cursor-pointer"
        )}
        onClick={item.onClick}
      >
        <span className="flex-shrink-0">{item.icon}</span>
        {!collapsed && <span>{item.name}</span>}
      </div>
    );

    const wrappedContent = item.href ? (
      <Link to={item.href}>
        {navContent}
      </Link>
    ) : navContent;

    // If sidebar is collapsed, wrap in tooltip
    if (collapsed) {
      return (
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>{wrappedContent}</TooltipTrigger>
          <TooltipContent side="right">{item.name}</TooltipContent>
        </Tooltip>
      );
    }

    // Otherwise return the content directly
    return wrappedContent;
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col justify-between h-full">
        <div>
          <ul className="space-y-1 px-2">
            {navigation.map((item: NavigationItem) => (
              <li key={item.name}>
                {renderNavItem(item)}
              </li>
            ))}
          </ul>
          
          {/* Separator and Information/About section */}
          <div className="mt-4 mb-4 px-2">
            <div className="flex items-center gap-2">
              <Separator className={cn("bg-sidebar-border/50", collapsed ? "w-8 mx-auto" : "w-full")} />
              {!collapsed && (
                <Minus className="h-4 w-4 text-sidebar-border/70 flex-shrink-0" />
              )}
            </div>
          </div>
          
          <ul className="space-y-1 px-2">
            {informationNavigation.map((item: NavigationItem) => (
              <li key={item.name}>
                {renderNavItem(item)}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Admin section at bottom, above profile */}
        {adminNavigation.length > 0 && (
          <ul className="mt-auto mb-2 px-2">
            {adminNavigation.map((item: NavigationItem) => (
              <li key={item.name}>
                {renderNavItem(item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </TooltipProvider>
  );
};
